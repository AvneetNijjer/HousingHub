-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (this is automatically created by Supabase Auth, but we'll add additional columns)
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    bedrooms INTEGER NOT NULL CHECK (bedrooms > 0),
    bathrooms DECIMAL(3,1) NOT NULL CHECK (bathrooms > 0),
    square_feet INTEGER CHECK (square_feet > 0),
    property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'condo', 'townhouse')),
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON public.favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON public.messages(listing_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for listings
CREATE POLICY "Public listings are viewable by everyone"
    ON public.listings FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own listings"
    ON public.listings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
    ON public.listings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
    ON public.listings FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for messages
CREATE POLICY "Users can view messages they sent or received"
    ON public.messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
    ON public.messages FOR UPDATE
    USING (auth.uid() = sender_id);

-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete user's listings
    DELETE FROM public.listings WHERE user_id = OLD.id;
    -- Delete user's favorites
    DELETE FROM public.favorites WHERE user_id = OLD.id;
    -- Delete user's messages
    DELETE FROM public.messages WHERE sender_id = OLD.id OR receiver_id = OLD.id;
    RETURN OLD;
END;
$$ language 'plpgsql';

-- Create trigger for user deletion
CREATE TRIGGER on_user_deletion
    BEFORE DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_deletion(); 
-- First, let's create some sample users
-- Note: These users will be created through auth.signUp in the app
-- We're just adding their profile data here

-- Add profile data for user 1
INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'john.doe@example.com',
    '{"username": "johndoe", "first_name": "John", "last_name": "Doe", "phone_number": "555-123-4567", "profile_picture": "https://example.com/profile1.jpg", "is_verified": true}'
);

-- Add profile data for user 2
INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES
(
    '00000000-0000-0000-0000-000000000002',
    'jane.smith@example.com',
    '{"username": "janesmith", "first_name": "Jane", "last_name": "Smith", "phone_number": "555-987-6543", "profile_picture": "https://example.com/profile2.jpg", "is_verified": true}'
);

-- Insert sample listings
INSERT INTO public.listings (
    id,
    title,
    description,
    price,
    address,
    city,
    state,
    zip_code,
    latitude,
    longitude,
    bedrooms,
    bathrooms,
    square_feet,
    property_type,
    amenities,
    images,
    is_available,
    user_id,
    created_at,
    updated_at
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Modern Downtown Apartment',
    'Beautiful modern apartment in the heart of downtown. Close to all amenities and public transportation.',
    2500.00,
    '123 Main St',
    'San Francisco',
    'CA',
    '94105',
    37.7749,
    -122.4194,
    2,
    2.0,
    1200,
    'apartment',
    ARRAY['parking', 'gym', 'pool'],
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    true,
    '00000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222',
    'Cozy Studio Near Campus',
    'Perfect for students, this studio apartment is just a 5-minute walk from campus.',
    1200.00,
    '456 College Ave',
    'Berkeley',
    'CA',
    '94704',
    37.8719,
    -122.2585,
    1,
    1.0,
    600,
    'apartment',
    ARRAY['furnished', 'utilities included'],
    ARRAY['https://example.com/image3.jpg', 'https://example.com/image4.jpg'],
    true,
    '00000000-0000-0000-0000-000000000002',
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333',
    'Luxury Condo with View',
    'Stunning luxury condo with panoramic city views. High-end finishes throughout.',
    3500.00,
    '789 Market St',
    'San Francisco',
    'CA',
    '94103',
    37.7749,
    -122.4194,
    3,
    2.5,
    1800,
    'condo',
    ARRAY['doorman', 'gym', 'rooftop deck'],
    ARRAY['https://example.com/image5.jpg', 'https://example.com/image6.jpg'],
    true,
    '00000000-0000-0000-0000-000000000001',
    NOW(),
    NOW()
);

-- Insert sample favorites
INSERT INTO public.favorites (id, user_id, listing_id, created_at) VALUES
(
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    NOW()
),
(
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    NOW()
);

-- Insert sample messages
INSERT INTO public.messages (id, sender_id, receiver_id, listing_id, content, is_read, created_at) VALUES
(
    '66666666-6666-6666-6666-666666666666',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'Is the apartment still available?',
    false,
    NOW()
),
(
    '77777777-7777-7777-7777-777777777777',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Yes, it is! Would you like to schedule a viewing?',
    false,
    NOW()
); 
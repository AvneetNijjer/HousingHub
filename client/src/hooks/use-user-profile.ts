import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadImage, getImageUrl } from '@/lib/storage';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profile_image: string;
  preferences: {
    maxRent?: number;
    housingType?: string[];
    bedrooms?: string;
    lookingFor?: string;
    roommates?: boolean;
  };
}

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) setError(error.message);
    else setProfile(data);
    setLoading(false);
  };

  const uploadProfileImage = async (file: File) => {
    if (!userId) return;
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    await uploadImage(file, 'profile-pictures', filePath);
    const publicUrl = getImageUrl('profile-pictures', filePath);
    await updateProfile({ profile_image: publicUrl });
    return publicUrl;
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadProfileImage,
    setProfile,
  };
} 
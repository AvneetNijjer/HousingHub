import { supabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

const typedSupabase = supabase as SupabaseClient;

export const uploadImage = async (file: File, bucket: string, path: string) => {
  const { data, error } = await typedSupabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;
  return data;
};

export const getImageUrl = (bucket: string, path: string) => {
  const { data } = typedSupabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
};

export const deleteImage = async (bucket: string, path: string) => {
  const { error } = await typedSupabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
}; 
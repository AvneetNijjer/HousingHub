import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Favorite } from '../../../shared/schema';

export function useFavorites(userId: string) {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('userId', userId);
      
      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!userId,
  });

  const addFavorite = useMutation({
    mutationFn: async (listingId: string) => {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ userId, listingId }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Favorite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('userId', userId)
        .eq('listingId', listingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
  };
} 
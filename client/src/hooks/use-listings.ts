import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/lib/data';

export function useListings() {
  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return data as Listing[];
    },
  });

  const createListing = useMutation({
    mutationFn: async (newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('listings')
        .insert([newListing])
        .select()
        .single();
      
      if (error) throw error;
      return data as Listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  const updateListing = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Listing> & { id: string }) => {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });

  return {
    listings,
    isLoading,
    createListing,
    updateListing,
    deleteListing,
  };
} 
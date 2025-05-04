import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext, ReactNode } from 'react';

const typedSupabase = supabase as SupabaseClient;

interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  note?: string;
  collectionName?: string;
  createdAt: string;
}

interface FavoritesContextType {
  favorites: Favorite[] | undefined;
  isLoading: boolean;
  isFavorite: (listingId: string) => boolean;
  addFavorite: (listingId: string) => Promise<void>;
  removeFavorite: (listingId: string) => Promise<void>;
  getFavoriteNote: (listingId: string) => string | undefined;
  addNoteToFavorite: (listingId: string, note: string) => Promise<void>;
  collections: string[];
  createCollection: (name: string) => Promise<void>;
  addToCollection: (collectionName: string, listingId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
  userId: string;
}

export function FavoritesProvider({ children, userId }: FavoritesProviderProps) {
  const {
    favorites,
    isLoading,
    isFavorite,
    addFavorite: addFavoriteMutation,
    removeFavorite: removeFavoriteMutation,
    getFavoriteNote,
    addNoteToFavorite,
    collections,
    createCollection,
    addToCollection
  } = useFavorites(userId);
  
  const value: FavoritesContextType = {
    favorites,
    isLoading,
    isFavorite,
    addFavorite: async (listingId: string) => {
      await addFavoriteMutation(listingId);
    },
    removeFavorite: async (listingId: string) => {
      await removeFavoriteMutation(listingId);
    },
    getFavoriteNote,
    addNoteToFavorite,
    collections,
    createCollection,
    addToCollection
  };

  return React.createElement(FavoritesContext.Provider, { value }, children);
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}

export function useFavorites(userId: string) {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      const { data, error } = await typedSupabase
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
      const { data, error } = await typedSupabase
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
      const { error } = await typedSupabase
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

  const addNoteToFavorite = useMutation({
    mutationFn: async ({ listingId, note }: { listingId: string; note: string }) => {
      const { error } = await typedSupabase
        .from('favorites')
        .update({ note })
        .eq('userId', userId)
        .eq('listingId', listingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });

  const collections = Array.from(
    new Set(
      favorites
        ?.map(fav => fav.collectionName)
        .filter((name): name is string => typeof name === 'string' && name.length > 0) ?? []
    )
  ).sort();

  const createCollection = async (name: string) => {
    if (!name.trim()) {
      throw new Error('Collection name cannot be empty');
    }
    // Collections are just tags on favorites, so no need to create them separately
    return Promise.resolve();
  };

  const addToCollection = useMutation({
    mutationFn: async ({ listingId, collectionName }: { listingId: string; collectionName: string }) => {
      if (!collectionName.trim()) {
        throw new Error('Collection name cannot be empty');
      }
      const { error } = await typedSupabase
        .from('favorites')
        .update({ collectionName: collectionName.trim() })
        .eq('userId', userId)
        .eq('listingId', listingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });

  const isFavorite = (listingId: string) => {
    return favorites?.some(fav => fav.listingId === listingId) ?? false;
  };

  const getFavoriteNote = (listingId: string) => {
    return favorites?.find(fav => fav.listingId === listingId)?.note;
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    addFavorite: addFavorite.mutateAsync,
    removeFavorite: removeFavorite.mutateAsync,
    getFavoriteNote,
    addNoteToFavorite: (listingId: string, note: string) => addNoteToFavorite.mutateAsync({ listingId, note }),
    collections,
    createCollection,
    addToCollection: (collectionName: string, listingId: string) => addToCollection.mutateAsync({ listingId, collectionName }),
  };
} 
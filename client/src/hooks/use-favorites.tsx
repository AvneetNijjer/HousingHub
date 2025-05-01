import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Listing } from '@/lib/data';

interface FavoritesContextProps {
  favorites: Listing[];
  collections: { [key: string]: Listing[] };
  addFavorite: (listing: Listing) => void;
  removeFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  createCollection: (name: string) => void;
  addToCollection: (collectionName: string, listing: Listing) => void;
  removeFromCollection: (collectionName: string, listingId: string) => void;
  deleteCollection: (name: string) => void;
  addNoteToFavorite: (listingId: string, note: string) => void;
  getFavoriteNote: (listingId: string) => string | null;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [collections, setCollections] = useState<{ [key: string]: Listing[] }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    const savedCollections = localStorage.getItem('favoriteCollections');
    const savedNotes = localStorage.getItem('favoriteNotes');

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage', error);
      }
    }

    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (error) {
        console.error('Error parsing collections from localStorage', error);
      }
    }

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error parsing notes from localStorage', error);
      }
    }
  }, []);

  // Save data to localStorage when changes occur
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('favoriteCollections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('favoriteNotes', JSON.stringify(notes));
  }, [notes]);

  const addFavorite = (listing: Listing) => {
    if (!favorites.some(fav => fav.id === listing.id)) {
      setFavorites([...favorites, listing]);
    }
  };

  const removeFavorite = (listingId: string) => {
    setFavorites(favorites.filter(listing => listing.id !== listingId));
    
    // Also remove from any collections
    const updatedCollections = { ...collections };
    Object.keys(updatedCollections).forEach(collection => {
      updatedCollections[collection] = updatedCollections[collection].filter(
        listing => listing.id !== listingId
      );
    });
    setCollections(updatedCollections);
    
    // Remove notes
    const updatedNotes = { ...notes };
    delete updatedNotes[listingId];
    setNotes(updatedNotes);
  };

  const isFavorite = (listingId: string) => {
    return favorites.some(listing => listing.id === listingId);
  };

  const createCollection = (name: string) => {
    if (!collections[name]) {
      setCollections({
        ...collections,
        [name]: []
      });
    }
  };

  const addToCollection = (collectionName: string, listing: Listing) => {
    // Create collection if it doesn't exist
    if (!collections[collectionName]) {
      setCollections({
        ...collections,
        [collectionName]: [listing]
      });
      return;
    }

    // Add to existing collection if not already there
    if (!collections[collectionName].some(item => item.id === listing.id)) {
      setCollections({
        ...collections,
        [collectionName]: [...collections[collectionName], listing]
      });
    }

    // Make sure listing is also in favorites
    if (!favorites.some(fav => fav.id === listing.id)) {
      setFavorites([...favorites, listing]);
    }
  };

  const removeFromCollection = (collectionName: string, listingId: string) => {
    if (collections[collectionName]) {
      setCollections({
        ...collections,
        [collectionName]: collections[collectionName].filter(
          listing => listing.id !== listingId
        )
      });
    }
  };

  const deleteCollection = (name: string) => {
    const { [name]: _, ...remainingCollections } = collections;
    setCollections(remainingCollections);
  };

  const addNoteToFavorite = (listingId: string, note: string) => {
    setNotes({
      ...notes,
      [listingId]: note
    });
  };

  const getFavoriteNote = (listingId: string) => {
    return notes[listingId] || null;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        collections,
        addFavorite,
        removeFavorite,
        isFavorite,
        createCollection,
        addToCollection,
        removeFromCollection,
        deleteCollection,
        addNoteToFavorite,
        getFavoriteNote
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
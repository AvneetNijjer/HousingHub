import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import ListingCard from '@/components/listings/ListingCard';
import ListingsFilters, { ListingFilters } from '@/components/listings/ListingsFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogTitle,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import { Listing, listings as mockListings } from '@/lib/data';

const Listings = () => {
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<ListingFilters>({
    priceRange: { min: '', max: '' },
    bedrooms: 'any',
    bathrooms: 'any',
    distanceFromCampus: null,
    amenities: {
      wifi: false,
      laundry: false,
      furnished: false,
      parking: false,
      pets: false,
      gym: false,
      pool: false,
      security: false
    },
    housingType: {
      apartment: false,
      house: false,
      dormitory: false,
      studio: false
    },
    availabilityDate: '',
    furnished: 'any',
    sortBy: 'recommended'
  });
  
  // State for advanced search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch listings from Supabase or fallback to mock data
  const { data: listings, isLoading, error } = useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error || !data) {
        // Fallback to mock data if Supabase is not configured or returns error
        return mockListings;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
        localStorage.removeItem('searchHistory');
      }
    }
  }, []);

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 2) {
      // Generate suggestions based on search query
      const newSuggestions = [
        `${searchQuery} near campus`,
        `${searchQuery} with utilities included`,
        `cheap ${searchQuery}`,
        `luxury ${searchQuery}`,
        `furnished ${searchQuery}`
      ];
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Add search query to history
  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query).slice(0, 9)
    ];
    setSearchHistory(updatedHistory);
    try {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    setIsSearchHistoryOpen(false);
  };

  // Handle search
  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    addToSearchHistory(query);
    setSearchQuery(query);
    setShowSuggestions(false);
    
    // Filter listings based on search query
    if (listings) {
      const filtered = listings.filter(listing => 
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase()) ||
        (listing.address?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (listing.location?.toLowerCase().includes(query.toLowerCase()) ?? false)
      );
      setFilteredListings(filtered);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    if (!listings) return;

    let result = [...listings];
    
    // Apply price range filter
    if (activeFilters.priceRange) {
      const minPrice = activeFilters.priceRange.min ? Number(activeFilters.priceRange.min) : undefined;
      const maxPrice = activeFilters.priceRange.max ? Number(activeFilters.priceRange.max) : undefined;
      
      if (minPrice !== undefined && !isNaN(minPrice)) {
        result = result.filter(listing => listing.price >= minPrice);
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        result = result.filter(listing => listing.price <= maxPrice);
      }
    }
    
    // Apply bedrooms filter
    if (activeFilters.bedrooms && activeFilters.bedrooms !== 'any') {
      if (activeFilters.bedrooms === '3+') {
        result = result.filter(listing => listing.bedrooms >= 3);
      } else {
        const bedrooms = Number(activeFilters.bedrooms);
        if (!isNaN(bedrooms)) {
          result = result.filter(listing => listing.bedrooms === bedrooms);
        }
      }
    }
    
    // Apply bathrooms filter
    if (activeFilters.bathrooms && activeFilters.bathrooms !== 'any') {
      const bathrooms = Number(activeFilters.bathrooms);
      if (!isNaN(bathrooms)) {
        result = result.filter(listing => listing.bathrooms === bathrooms);
      }
    }
    
    // Apply property type filter
    const selectedTypes = Object.entries(activeFilters.housingType)
      .filter(([_, selected]) => selected)
      .map(([type]) => type.toLowerCase());
    
    if (selectedTypes.length > 0) {
      result = result.filter(listing => 
        selectedTypes.includes(listing.type.toLowerCase())
      );
    }
    
    // Apply amenities filter
    const selectedAmenities = Object.entries(activeFilters.amenities)
      .filter(([_, selected]) => selected)
      .map(([amenity]) => amenity.toLowerCase());
    
    if (selectedAmenities.length > 0) {
      result = result.filter(listing => 
        selectedAmenities.every(amenity => 
          listing.amenities.some(a => a.toLowerCase() === amenity)
        )
      );
    }
    
    // Apply sorting
    switch (activeFilters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // 'recommended' - no sorting needed
        break;
    }
    
    setFilteredListings(result);
  }, [listings, activeFilters]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading listings</h2>
          <p className="text-gray-600 mb-4">
            {error.message === 'Supabase not configured' 
              ? 'Please configure your Supabase environment variables in the .env file'
              : 'Please try again later'}
          </p>
          {error.message === 'Supabase not configured' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                Required environment variables:
                <br />
                VITE_SUPABASE_URL=your_supabase_project_url
                <br />
                VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
              </p>
            </div>
          )}
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/3 md:max-w-sm">
            <ListingsFilters onFilterChange={setActiveFilters} />
          </div>
          {/* Listings Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search for housing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pr-12"
                />
                <Button
                  onClick={() => handleSearch()}
                  className="absolute right-2"
                >
                  <i className="fas fa-search"></i>
                </Button>
              </div>
              {/* Search Suggestions */}
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSearch(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* View Toggle */}
            <div className="flex items-center space-x-2 mb-8">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th-large"></i>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </Button>
            </div>
            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.entries(activeFilters.amenities)
                .filter(([_, selected]) => selected)
                .map(([amenity]) => (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      setActiveFilters(prev => ({
                        ...prev,
                        amenities: {
                          ...prev.amenities,
                          [amenity]: false
                        }
                      }));
                    }}
                  >
                    {amenity} <i className="fas fa-times ml-1"></i>
                  </Badge>
                ))}
            </div>
            {/* Listings Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6' : 'space-y-6'}>
              {filteredListings.map((listing, index) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  index={index}
                />
              ))}
            </div>
            {/* No Results */}
            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
        {/* Search History Dialog */}
        <Dialog open={isSearchHistoryOpen} onOpenChange={setIsSearchHistoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search History</DialogTitle>
              <DialogDescription>
                Your recent searches
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {searchHistory.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => {
                    handleSearch(query);
                    setIsSearchHistoryOpen(false);
                  }}
                >
                  <span className="text-gray-700">{query}</span>
                  <i className="fas fa-history text-gray-400"></i>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={clearSearchHistory}>
                Clear History
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Listings;

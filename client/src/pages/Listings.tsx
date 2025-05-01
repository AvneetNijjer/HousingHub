import { useState, useEffect } from 'react';
import { Listing, listings } from '@/lib/data';
import ListingCard from '@/components/listings/ListingCard';
import ListingsFilters, { ListingFilters } from '@/components/listings/ListingsFilters';
import { motion } from 'framer-motion';
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

const Listings = () => {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const [viewMode, setViewMode] = useState('grid');
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

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
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
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    setIsSearchHistoryOpen(false);
  };

  // Handle search submission
  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    
    addToSearchHistory(searchTerm);
    setShowSuggestions(false);

    // Process natural language search
    const lowercaseQuery = searchTerm.toLowerCase();
    
    // Create new filters based on the search query
    const newFilters = { ...activeFilters };
    
    // Check for bedroom count in query
    if (lowercaseQuery.includes('1 bed') || lowercaseQuery.includes('one bed') || lowercaseQuery.includes('single bed')) {
      newFilters.bedrooms = '1';
    } else if (lowercaseQuery.includes('2 bed') || lowercaseQuery.includes('two bed')) {
      newFilters.bedrooms = '2';
    } else if (lowercaseQuery.includes('3 bed') || lowercaseQuery.includes('three bed') || lowercaseQuery.match(/\d\+ bed/)) {
      newFilters.bedrooms = '3+';
    }
    
    // Check for property type in query
    if (lowercaseQuery.includes('apartment')) {
      newFilters.housingType.apartment = true;
    }
    if (lowercaseQuery.includes('house')) {
      newFilters.housingType.house = true;
    }
    if (lowercaseQuery.includes('dorm')) {
      newFilters.housingType.dormitory = true;
    }
    if (lowercaseQuery.includes('studio')) {
      newFilters.housingType.studio = true;
    }
    
    // Check for amenities in query
    if (lowercaseQuery.includes('wifi') || lowercaseQuery.includes('internet')) {
      newFilters.amenities.wifi = true;
    }
    if (lowercaseQuery.includes('laundry') || lowercaseQuery.includes('washer')) {
      newFilters.amenities.laundry = true;
    }
    if (lowercaseQuery.includes('furnished')) {
      newFilters.amenities.furnished = true;
      newFilters.furnished = 'furnished';
    }
    if (lowercaseQuery.includes('parking') || lowercaseQuery.includes('garage')) {
      newFilters.amenities.parking = true;
    }
    if (lowercaseQuery.includes('pet') || lowercaseQuery.includes('dog') || lowercaseQuery.includes('cat')) {
      newFilters.amenities.pets = true;
    }
    if (lowercaseQuery.includes('gym') || lowercaseQuery.includes('fitness')) {
      newFilters.amenities.gym = true;
    }
    if (lowercaseQuery.includes('pool') || lowercaseQuery.includes('swimming')) {
      newFilters.amenities.pool = true;
    }
    if (lowercaseQuery.includes('security') || lowercaseQuery.includes('safe')) {
      newFilters.amenities.security = true;
    }
    
    // Check for price range in query
    const priceMatches = lowercaseQuery.match(/(\$|\bunder\b|\bup to\b|\bless than\b|\bmax\b) ?(\d+)/);
    if (priceMatches) {
      const priceValue = priceMatches[2];
      if (lowercaseQuery.includes('under') || lowercaseQuery.includes('up to') || lowercaseQuery.includes('less than') || lowercaseQuery.includes('max')) {
        newFilters.priceRange.max = priceValue;
      } else {
        // If just a price is mentioned, assume it's a max price
        newFilters.priceRange.max = priceValue;
      }
    }
    
    // Check for distance in query
    if (lowercaseQuery.includes('near campus') || lowercaseQuery.includes('close to campus')) {
      newFilters.distanceFromCampus = 1.0;
    }
    
    // Apply the filters
    setActiveFilters(newFilters);
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...listings];
    
    // Apply price range filter
    if (activeFilters.priceRange) {
      if (activeFilters.priceRange.min) {
        result = result.filter(listing => listing.price >= Number(activeFilters.priceRange.min));
      }
      if (activeFilters.priceRange.max) {
        result = result.filter(listing => listing.price <= Number(activeFilters.priceRange.max));
      }
    }
    
    // Apply bedrooms filter
    if (activeFilters.bedrooms && activeFilters.bedrooms !== 'any') {
      if (activeFilters.bedrooms === '3+') {
        result = result.filter(listing => listing.bedrooms >= 3);
      } else {
        result = result.filter(listing => listing.bedrooms === Number(activeFilters.bedrooms));
      }
    }
    
    // Apply bathrooms filter
    if (activeFilters.bathrooms && activeFilters.bathrooms !== 'any') {
      if (activeFilters.bathrooms === '3+') {
        result = result.filter(listing => 
          typeof listing.bathrooms === 'number' && listing.bathrooms >= 3
        );
      } else {
        result = result.filter(listing => 
          listing.bathrooms === Number(activeFilters.bathrooms) || 
          listing.bathrooms === activeFilters.bathrooms
        );
      }
    }
    
    // Apply distance from campus filter
    if (activeFilters.distanceFromCampus !== null) {
      result = result.filter(listing => {
        const distance = listing.distanceFromCampus 
          ? parseFloat(listing.distanceFromCampus.replace(/[^0-9.]/g, '')) 
          : 10; // Default to far if no distance specified
        return distance <= (activeFilters.distanceFromCampus || 10);
      });
    }
    
    // Apply availability date filter
    if (activeFilters.availabilityDate) {
      const selectedDate = new Date(activeFilters.availabilityDate);
      result = result.filter(listing => {
        if (!listing.availableFrom) return true; // Include if no availability date specified
        const availableDate = new Date(listing.availableFrom);
        return availableDate <= selectedDate;
      });
    }
    
    // Apply furnished status filter
    if (activeFilters.furnished !== 'any') {
      result = result.filter(listing => {
        if (activeFilters.furnished === 'furnished') {
          return listing.furnished === true;
        } else {
          return listing.furnished === false;
        }
      });
    }
    
    // Apply amenities filters
    if (activeFilters.amenities) {
      const selectedAmenities = Object.entries(activeFilters.amenities)
        .filter(([_, isSelected]) => isSelected)
        .map(([amenity]) => amenity);
      
      if (selectedAmenities.length > 0) {
        result = result.filter(listing => {
          // Check if listing has at least one of the selected amenities
          return selectedAmenities.some(amenity => {
            // Map the filter amenity names to the actual amenity names in the listing
            const amenityMap: Record<string, string> = {
              'wifi': 'WiFi',
              'laundry': 'Laundry',
              'furnished': 'Furnished',
              'parking': 'Parking',
              'pets': 'Pets',
              'gym': 'Gym',
              'pool': 'Pool',
              'security': 'Security System'
            };
            
            return listing.amenities.includes(amenityMap[amenity]);
          });
        });
      }
    }
    
    // Apply housing type filters
    if (activeFilters.housingType) {
      const selectedTypes = Object.entries(activeFilters.housingType)
        .filter(([_, isSelected]) => isSelected)
        .map(([type]) => type);
      
      if (selectedTypes.length > 0) {
        result = result.filter(listing => {
          // Check if listing matches any of the selected housing types
          return selectedTypes.some(type => {
            // Map the filter type names to the actual types in the listing
            const typeMap: Record<string, string> = {
              'apartment': 'Apartment',
              'house': 'House',
              'dormitory': 'Dormitory',
              'studio': 'Studio'
            };
            
            return listing.type === typeMap[type];
          });
        });
      }
    }
    
    // Apply sorting
    if (activeFilters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeFilters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (activeFilters.sortBy === 'newest') {
      // Sort by availableFrom date, newest first
      result.sort((a, b) => {
        const dateA = a.availableFrom ? new Date(a.availableFrom).getTime() : 0;
        const dateB = b.availableFrom ? new Date(b.availableFrom).getTime() : 0;
        return dateB - dateA;
      });
    } else if (activeFilters.sortBy === 'closest') {
      // Sort by distance to campus
      result.sort((a, b) => {
        const distanceA = a.distanceFromCampus 
          ? parseFloat(a.distanceFromCampus.replace(/[^0-9.]/g, '')) 
          : 10;
        const distanceB = b.distanceFromCampus 
          ? parseFloat(b.distanceFromCampus.replace(/[^0-9.]/g, '')) 
          : 10;
        return distanceA - distanceB;
      });
    }
    // 'recommended' doesn't need sorting as it's the default order
    
    setFilteredListings(result);
  }, [activeFilters]);

  const handleFilterChange = (filters: ListingFilters) => {
    setActiveFilters(filters);
  };

  return (
    <section className="py-32" id="listings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-primary-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Student Housing Listings
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Browse our curated selection of student-friendly housing options near top universities.
          </motion.p>
        </div>
        
        {/* Advanced Search Section */}
        <motion.div 
          className="mb-8 bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search for apartments, houses near campus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="pl-10 pr-4 py-3 w-full rounded-l-lg border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-30"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <Button 
                onClick={() => handleSearch()}
                className="rounded-l-none rounded-r-lg px-6 bg-primary-700 hover:bg-primary-800"
              >
                Search
              </Button>
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                  >
                    <i className="fas fa-search text-gray-400 mr-2"></i>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex mt-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Selected filters badges */}
              {activeFilters.bedrooms !== 'any' && (
                <Badge variant="outline" className="bg-blue-50">
                  {activeFilters.bedrooms === '3+' ? '3+ Beds' : `${activeFilters.bedrooms} Bed`}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setActiveFilters({
                        ...activeFilters,
                        bedrooms: 'any'
                      });
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </Badge>
              )}
              
              {activeFilters.bathrooms !== 'any' && (
                <Badge variant="outline" className="bg-blue-50">
                  {activeFilters.bathrooms === '3+' ? '3+ Baths' : `${activeFilters.bathrooms} Bath`}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setActiveFilters({
                        ...activeFilters,
                        bathrooms: 'any'
                      });
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </Badge>
              )}
              
              {activeFilters.priceRange.min && (
                <Badge variant="outline" className="bg-blue-50">
                  Min: ${activeFilters.priceRange.min}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setActiveFilters({
                        ...activeFilters,
                        priceRange: {
                          ...activeFilters.priceRange,
                          min: ''
                        }
                      });
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </Badge>
              )}
              
              {activeFilters.priceRange.max && (
                <Badge variant="outline" className="bg-blue-50">
                  Max: ${activeFilters.priceRange.max}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setActiveFilters({
                        ...activeFilters,
                        priceRange: {
                          ...activeFilters.priceRange,
                          max: ''
                        }
                      });
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </Badge>
              )}
              
              {activeFilters.distanceFromCampus !== null && (
                <Badge variant="outline" className="bg-blue-50">
                  Within {(activeFilters.distanceFromCampus || 0).toFixed(1)} miles of campus
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setActiveFilters({
                        ...activeFilters,
                        distanceFromCampus: null
                      });
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </Badge>
              )}
            </div>
            
            <button
              className="text-sm text-primary-700 hover:text-primary-800 hover:underline flex items-center"
              onClick={() => setIsSearchHistoryOpen(true)}
            >
              <i className="fas fa-history mr-1"></i> Search History
            </button>
          </div>
        </motion.div>
        
        {/* Search History Dialog */}
        <Dialog open={isSearchHistoryOpen} onOpenChange={setIsSearchHistoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search History</DialogTitle>
              <DialogDescription>
                Your recent property searches
              </DialogDescription>
            </DialogHeader>
            
            {searchHistory.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                <i className="fas fa-history text-4xl mb-2"></i>
                <p>No search history yet</p>
              </div>
            ) : (
              <div className="space-y-2 my-4">
                {searchHistory.map((query, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(query);
                      handleSearch(query);
                      setIsSearchHistoryOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <i className="fas fa-search text-gray-400 mr-2"></i>
                      <span>{query}</span>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchHistory(searchHistory.filter((_, i) => i !== index));
                        localStorage.setItem('searchHistory', JSON.stringify(
                          searchHistory.filter((_, i) => i !== index)
                        ));
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={clearSearchHistory}
                disabled={searchHistory.length === 0}
              >
                Clear History
              </Button>
              <Button onClick={() => setIsSearchHistoryOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="flex flex-col lg:flex-row">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 mb-8 lg:mb-0 lg:pr-8">
            <ListingsFilters onFilterChange={handleFilterChange} />
          </div>
          
          {/* Listings Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="text-gray-600 mb-4 sm:mb-0">
                Showing <span className="font-semibold">{filteredListings.length}</span> listings
              </p>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select 
                  className="text-sm rounded-md border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  value={activeFilters.sortBy}
                  onChange={(e) => setActiveFilters({
                    ...activeFilters,
                    sortBy: e.target.value
                  })}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="closest">Closest to Campus</option>
                </select>
                
                <div className="hidden sm:flex space-x-2">
                  <button 
                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`} 
                    title="Grid view"
                    onClick={() => setViewMode('grid')}
                  >
                    <i className={`fas fa-th-large ${viewMode === 'grid' ? 'text-primary-800' : 'text-gray-400'}`}></i>
                  </button>
                  <button 
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`} 
                    title="List view"
                    onClick={() => setViewMode('list')}
                  >
                    <i className={`fas fa-list ${viewMode === 'list' ? 'text-primary-800' : 'text-gray-400'}`}></i>
                  </button>
                </div>
              </div>
            </div>
            
            {filteredListings.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredListings.map((listing, index) => (
                  <ListingCard key={listing.id} listing={listing} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
            
            {filteredListings.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <a href="#" className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    <i className="fas fa-chevron-left"></i>
                  </a>
                  <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">1</a>
                  <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-primary-50 text-primary-800 font-medium">2</a>
                  <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</a>
                  <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">4</a>
                  <a href="#" className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listings;

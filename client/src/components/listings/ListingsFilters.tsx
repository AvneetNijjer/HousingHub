import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define the filter state type
export interface ListingFilters {
  priceRange: { min: string; max: string };
  bedrooms: string;
  bathrooms: string;
  distanceFromCampus: number | null;
  amenities: {
    wifi: boolean;
    laundry: boolean;
    furnished: boolean;
    parking: boolean;
    pets: boolean;
    gym: boolean;
    pool: boolean;
    security: boolean;
  };
  housingType: {
    apartment: boolean;
    house: boolean;
    dormitory: boolean;
    studio: boolean;
  };
  availabilityDate: string;
  furnished: string;
  sortBy: string;
}

interface ListingsFiltersProps {
  onFilterChange: (filters: ListingFilters) => void;
}

const ListingsFilters = ({ onFilterChange }: ListingsFiltersProps) => {
  // Default state for filters
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedrooms, setBedrooms] = useState<string>('any');
  const [bathrooms, setBathrooms] = useState<string>('any');
  const [distanceFromCampus, setDistanceFromCampus] = useState<number | null>(null);
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: ListingFilters }>>([]);
  const [availabilityDate, setAvailabilityDate] = useState<string>('');
  const [furnished, setFurnished] = useState<string>('any');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [amenities, setAmenities] = useState({
    wifi: false,
    laundry: false,
    furnished: false,
    parking: false,
    pets: false,
    gym: false,
    pool: false,
    security: false
  });
  const [housingType, setHousingType] = useState({
    apartment: false,
    house: false,
    dormitory: false,
    studio: false
  });
  
  // New filter for saved filter name
  const [filterName, setFilterName] = useState('');

  const handleAmenityChange = (amenity: keyof typeof amenities) => {
    setAmenities({
      ...amenities,
      [amenity]: !amenities[amenity]
    });
  };

  const handleHousingTypeChange = (type: keyof typeof housingType) => {
    setHousingType({
      ...housingType,
      [type]: !housingType[type]
    });
  };

  const handleBedroomSelection = (value: string) => {
    setBedrooms(value);
  };

  const handleBathroomSelection = (value: string) => {
    setBathrooms(value);
  };

  // Load saved filters from localStorage
  useEffect(() => {
    const storedFilters = localStorage.getItem('savedFilters');
    if (storedFilters) {
      setSavedFilters(JSON.parse(storedFilters));
    }
  }, []);

  // Save filters to localStorage
  const saveFilter = () => {
    if (!filterName.trim()) return;
    
    const currentFilters: ListingFilters = {
      priceRange,
      bedrooms,
      bathrooms,
      distanceFromCampus,
      amenities,
      housingType,
      availabilityDate,
      furnished,
      sortBy
    };
    
    const updatedFilters = [...savedFilters, { name: filterName, filters: currentFilters }];
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
    setFilterName('');
  };

  // Apply a saved filter
  const applySavedFilter = (index: number) => {
    const filter = savedFilters[index].filters;
    setPriceRange(filter.priceRange);
    setBedrooms(filter.bedrooms);
    setBathrooms(filter.bathrooms);
    setDistanceFromCampus(filter.distanceFromCampus);
    setAmenities(filter.amenities);
    setHousingType(filter.housingType);
    setAvailabilityDate(filter.availabilityDate);
    setFurnished(filter.furnished);
    setSortBy(filter.sortBy);
    
    applyFilters(filter);
  };

  // Delete a saved filter
  const deleteSavedFilter = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFilters = savedFilters.filter((_, i) => i !== index);
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
  };

  const applyFilters = (customFilters?: ListingFilters) => {
    const filtersToApply = customFilters || {
      priceRange,
      bedrooms,
      bathrooms,
      distanceFromCampus,
      amenities,
      housingType,
      availabilityDate,
      furnished,
      sortBy
    };
    
    onFilterChange(filtersToApply);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-blue-100">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mr-2">
            <i className="fas fa-filter text-primary-700"></i>
          </div>
          <h3 className="text-xl font-semibold text-primary-800">Refine Results</h3>
        </div>
        
        <Select value={sortBy} onValueChange={(value) => {
          setSortBy(value);
          setTimeout(() => applyFilters(), 0);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="closest">Closest to Campus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Saved Filters Section */}
      {savedFilters.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-primary-800 mb-2">Saved Filters</h4>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer flex items-center gap-1 bg-gray-50 hover:bg-gray-100 py-2"
                onClick={() => applySavedFilter(index)}
              >
                {filter.name}
                <button 
                  className="ml-1 text-gray-400 hover:text-red-500" 
                  onClick={(e) => deleteSavedFilter(index, e)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center">
            <i className="fas fa-dollar-sign mr-2 text-primary-600"></i>
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">$</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="pl-8 block w-full rounded-full border-gray-200 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-30 text-sm py-2.5 border"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">$</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="pl-8 block w-full rounded-full border-gray-200 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-30 text-sm py-2.5 border"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center">
            <i className="fas fa-bed mr-2 text-primary-600"></i>
            Bedrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bedrooms === 'any' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBedroomSelection('any')}
            >
              Any
            </motion.button>
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bedrooms === '1' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBedroomSelection('1')}
            >
              1
            </motion.button>
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bedrooms === '2' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBedroomSelection('2')}
            >
              2
            </motion.button>
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bedrooms === '3+' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBedroomSelection('3+')}
            >
              3+
            </motion.button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center">
            <i className="fas fa-bath mr-2 text-primary-600"></i>
            Bathrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bathrooms === 'any' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBathroomSelection('any')}
            >
              Any
            </motion.button>
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bathrooms === '1' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBathroomSelection('1')}
            >
              1
            </motion.button>
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bathrooms === '2' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBathroomSelection('2')}
            >
              2
            </motion.button>
            <motion.button 
              className={`border rounded-full px-3 py-2 text-sm ${bathrooms === '3+' ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:border-primary-500'} transition-colors`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBathroomSelection('3+')}
            >
              3+
            </motion.button>
          </div>
        </div>
        
        {/* Distance from Campus */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center">
            <i className="fas fa-university mr-2 text-primary-600"></i>
            Distance from Campus
          </label>
          <div className="px-2">
            <Slider
              defaultValue={[1]}
              max={5}
              step={0.1}
              value={distanceFromCampus !== null ? [distanceFromCampus] : [5]}
              onValueChange={(value) => setDistanceFromCampus(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Closer</span>
              <span>{distanceFromCampus !== null ? `${distanceFromCampus.toFixed(1)} miles` : 'Any distance'}</span>
              <span>Further</span>
            </div>
            {distanceFromCampus !== null && (
              <div className="mt-2 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDistanceFromCampus(null)}
                  className="text-xs h-auto py-1"
                >
                  Clear <i className="fas fa-times ml-1"></i>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Availability Date */}
        <div>
          <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center">
            <i className="fas fa-calendar-alt mr-2 text-primary-600"></i>
            Available From
          </label>
          <div className="relative">
            <input 
              type="date" 
              className="block w-full rounded-lg border border-gray-200 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-30 text-sm py-2.5"
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {availabilityDate && (
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setAvailabilityDate('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Furnished Status */}
        <div>
          <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center">
            <i className="fas fa-couch mr-2 text-primary-600"></i>
            Furnished Status
          </label>
          <Select value={furnished} onValueChange={setFurnished}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="furnished">Furnished</SelectItem>
              <SelectItem value="unfurnished">Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amenities */}
        <Accordion type="single" collapsible className="bg-gray-50 rounded-xl p-4">
          <AccordionItem value="amenities" className="border-none">
            <AccordionTrigger className="py-0">
              <div className="flex items-center text-sm font-semibold text-primary-700">
                <i className="fas fa-check-circle mr-2 text-primary-600"></i>
                Amenities
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="wifi" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.wifi}
                    onChange={() => handleAmenityChange('wifi')}
                  />
                  <label htmlFor="wifi" className="ml-2 text-sm text-gray-700">WiFi Included</label>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="laundry" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.laundry}
                    onChange={() => handleAmenityChange('laundry')}
                  />
                  <label htmlFor="laundry" className="ml-2 text-sm text-gray-700">In-unit Laundry</label>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="furnished-amenity" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.furnished}
                    onChange={() => handleAmenityChange('furnished')}
                  />
                  <label htmlFor="furnished-amenity" className="ml-2 text-sm text-gray-700">Furnished</label>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="parking" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.parking}
                    onChange={() => handleAmenityChange('parking')}
                  />
                  <label htmlFor="parking" className="ml-2 text-sm text-gray-700">Parking</label>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="pets" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.pets}
                    onChange={() => handleAmenityChange('pets')}
                  />
                  <label htmlFor="pets" className="ml-2 text-sm text-gray-700">Pet Friendly</label>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="gym" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.gym}
                    onChange={() => handleAmenityChange('gym')}
                  />
                  <label htmlFor="gym" className="ml-2 text-sm text-gray-700">Gym Access</label>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="pool" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.pool}
                    onChange={() => handleAmenityChange('pool')}
                  />
                  <label htmlFor="pool" className="ml-2 text-sm text-gray-700">Swimming Pool</label>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="security" 
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={amenities.security}
                    onChange={() => handleAmenityChange('security')}
                  />
                  <label htmlFor="security" className="ml-2 text-sm text-gray-700">Security System</label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Housing Type */}
        <div>
          <label className="block text-sm font-semibold text-primary-700 mb-3 flex items-center">
            <i className="fas fa-home mr-2 text-primary-600"></i>
            Housing Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="apartment" 
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={housingType.apartment}
                onChange={() => handleHousingTypeChange('apartment')}
              />
              <label htmlFor="apartment" className="ml-2 text-sm text-gray-700">Apartment</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="house" 
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={housingType.house}
                onChange={() => handleHousingTypeChange('house')}
              />
              <label htmlFor="house" className="ml-2 text-sm text-gray-700">House</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="dormitory" 
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={housingType.dormitory}
                onChange={() => handleHousingTypeChange('dormitory')}
              />
              <label htmlFor="dormitory" className="ml-2 text-sm text-gray-700">Dormitory</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="studio" 
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={housingType.studio}
                onChange={() => handleHousingTypeChange('studio')}
              />
              <label htmlFor="studio" className="ml-2 text-sm text-gray-700">Studio</label>
            </div>
          </div>
        </div>

        {/* Save Filter Section */}
        <div className="bg-blue-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-primary-700 mb-2">Save This Filter</label>
          <div className="flex space-x-2">
            <Input
              placeholder="Name your filter"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={saveFilter}
              disabled={!filterName.trim()}
              className="flex-none"
            >
              <i className="fas fa-save mr-1"></i> Save
            </Button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="pt-4">
          <motion.button 
            className="w-full bg-primary-800 text-white rounded-full py-3 font-medium hover:bg-primary-700 transition-colors shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyFilters()}
          >
            <i className="fas fa-filter mr-2"></i> Apply Filters
          </motion.button>
          <button
            className="w-full text-gray-600 hover:text-primary-700 transition-colors text-sm py-2 mt-2"
            onClick={() => {
              // Reset all filters
              setPriceRange({ min: '', max: '' });
              setBedrooms('any');
              setBathrooms('any');
              setDistanceFromCampus(null);
              setAvailabilityDate('');
              setFurnished('any');
              setSortBy('recommended');
              setAmenities({
                wifi: false,
                laundry: false,
                furnished: false,
                parking: false,
                pets: false,
                gym: false,
                pool: false,
                security: false
              });
              setHousingType({
                apartment: false,
                house: false,
                dormitory: false,
                studio: false
              });
              
              // Apply reset filters
              applyFilters({
                priceRange: { min: '', max: '' },
                bedrooms: 'any',
                bathrooms: 'any',
                distanceFromCampus: null,
                availabilityDate: '',
                furnished: 'any',
                sortBy: 'recommended',
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
                }
              });
            }}
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingsFilters;

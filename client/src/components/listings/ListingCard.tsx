import { useState } from 'react';
import { Listing, landlords } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorites } from '@/hooks/use-favorites';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ListingCardProps {
  listing: Listing;
  index: number;
}

const ListingCard = ({ listing, index }: ListingCardProps) => {
  const { 
    isFavorite, 
    addFavorite, 
    removeFavorite,
    collections,
    createCollection,
    addToCollection,
    getFavoriteNote,
    addNoteToFavorite
  } = useFavorites();
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImage, setActiveImage] = useState(0);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [noteText, setNoteText] = useState(getFavoriteNote(listing.id) || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  
  // Find landlord for this listing if landlordId is available
  const landlord = listing.landlordId ? landlords.find(l => l.id === listing.landlordId) : null;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(listing.id)) {
      removeFavorite(listing.id);
    } else {
      addFavorite(listing);
    }
  };
  
  const handleSaveNote = () => {
    addNoteToFavorite(listing.id, noteText);
    setIsEditingNote(false);
  };
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName);
      addToCollection(newCollectionName, listing);
      setNewCollectionName('');
    }
  };

  // Function to get badge color based on property type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Apartment':
        return 'bg-blue-600';
      case 'House':
        return 'bg-green-600';
      case 'Dormitory':
        return 'bg-purple-600';
      case 'Studio':
        return 'bg-orange-600';
      default:
        return 'bg-primary-800';
    }
  };

  // Function to get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi':
        return 'fa-wifi';
      case 'Laundry':
        return 'fa-tshirt';
      case 'Furnished':
        return 'fa-couch';
      case 'Parking':
        return 'fa-parking';
      case 'Pets':
      case 'Pets Allowed':
        return 'fa-paw';
      case 'Gym':
        return 'fa-dumbbell';
      case 'Pool':
        return 'fa-swimming-pool';
      case 'Security':
      case 'Security System':
        return 'fa-shield-alt';
      case 'Meal Plan':
        return 'fa-utensils';
      case 'Utilities Included':
        return 'fa-bolt';
      case 'Backyard':
        return 'fa-tree';
      case 'Washer/Dryer':
        return 'fa-tshirt';
      case 'High-Speed Internet':
        return 'fa-wifi';
      case 'Study Area':
        return 'fa-book';
      default:
        return 'fa-check-circle';
    }
  };

  // Format bathroom display text
  const bathroomText = typeof listing.bathrooms === 'number' 
    ? `${listing.bathrooms} ${listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}` 
    : 'Shared Bathroom';

  return (
    <>
      <motion.div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-blue-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <div className="relative">
          <img 
            src={listing.imageUrl} 
            alt={listing.title}
            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className={`${getBadgeColor(listing.type)} text-white text-xs font-semibold rounded-full px-3 py-1 shadow-md`}>
              {listing.type}
            </span>
            <span className="bg-primary-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-full px-3 py-1 shadow-md">
              <i className="fas fa-map-marker-alt mr-1"></i> {listing.location}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-lg font-semibold text-white drop-shadow-md">
              {listing.title}
            </h3>
          </div>
          <motion.button 
            className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-md hover:bg-gray-100 transition-colors" 
            title={isFavorite(listing.id) ? "Remove from favorites" : "Add to favorites"}
            onClick={toggleFavorite}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <i className={`${isFavorite(listing.id) ? 'fas' : 'far'} fa-heart ${isFavorite(listing.id) ? 'text-red-500' : 'text-primary-600'}`}></i>
          </motion.button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-primary-50 text-primary-800 font-bold text-lg rounded-full px-4 py-1">
              ${listing.price}<span className="text-sm font-medium text-gray-600">/mo</span>
            </div>
            <motion.button 
              onClick={() => setIsDetailsOpen(true)}
              className="text-primary-700 font-medium hover:text-primary-800 transition-colors flex items-center gap-1 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full"
              whileHover={{ x: 3 }}
            >
              View Details <i className="fas fa-arrow-right ml-1 text-xs"></i>
            </motion.button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 border-b border-gray-100 pb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-2">
                <i className="fas fa-bed text-blue-500"></i>
              </div>
              <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-2">
                <i className="fas fa-bath text-green-500"></i>
              </div>
              <span>{typeof listing.bathrooms === 'number' ? `${listing.bathrooms} ${listing.bathrooms === 1 ? 'Bath' : 'Baths'}` : 'Shared Bath'}</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center mr-2">
                <i className="fas fa-ruler-combined text-yellow-500"></i>
              </div>
              <span>{listing.squareFeet} ft²</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{listing.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="bg-gray-50 text-gray-700 flex items-center text-xs rounded-full px-3 py-1.5 border border-gray-100">
                <i className={`fas ${getAmenityIcon(amenity)} mr-1.5 text-primary-600`}></i>
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="bg-gray-50 text-gray-700 flex items-center text-xs rounded-full px-3 py-1.5 border border-gray-100">
                <i className="fas fa-plus-circle mr-1.5 text-primary-600"></i>
                {listing.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Listing Detail Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-xl">
          <DialogTitle className="sr-only">{listing.title} - Property Details</DialogTitle>
          <DialogDescription className="sr-only">
            View detailed information about this {listing.type.toLowerCase()} including amenities, price, and contact information.
          </DialogDescription>
          
          <div className="sticky top-0 z-10 flex justify-end p-4 bg-white/80 backdrop-blur-sm border-b">
            <button 
              onClick={() => setIsDetailsOpen(false)}
              className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-times text-gray-600"></i>
            </button>
          </div>

          <div className="p-6">
            {/* Property Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                  <p className="text-lg text-gray-600 mt-1">
                    {listing.address || listing.location}
                  </p>
                </div>
                <div className="flex flex-col md:items-end">
                  <div className="text-3xl font-bold text-primary-700">${listing.price}<span className="text-lg font-normal text-gray-500">/month</span></div>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {listing.type}
                    </span>
                    {listing.availableFrom && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Available {new Date(listing.availableFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-6 border rounded-xl overflow-hidden">
              <div className="relative h-80">
                <img 
                  src={listing.additionalImages?.[activeImage] || listing.imageUrl} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={toggleFavorite}
                    className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className={`${isFavorite(listing.id) ? 'fas text-red-500' : 'far text-gray-600'} fa-heart`}></i>
                  </button>
                  
                  {isFavorite(listing.id) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button 
                          className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-50 transition-all duration-300 border border-primary-100 group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="fas fa-folder-plus text-primary-600 group-hover:text-primary-700 transition-colors group-hover:scale-110 transform duration-300"></i>
                          <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Add to collection
                          </span>
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl border-primary-100">
                        <DropdownMenuLabel className="font-semibold text-primary-800">
                          <i className="fas fa-layer-group mr-2 text-primary-500"></i> 
                          Add to Collection
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {Object.keys(collections).map((collectionName) => (
                          <DropdownMenuItem 
                            key={collectionName}
                            onClick={() => addToCollection(collectionName, listing)}
                            className="cursor-pointer hover:bg-primary-50 focus:bg-primary-50 rounded-md transition-colors"
                          >
                            <i className="fas fa-folder-open mr-2 text-primary-500"></i>
                            {collectionName}
                          </DropdownMenuItem>
                        ))}
                        
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          <div className="text-xs text-gray-500 mb-2">
                            <i className="fas fa-info-circle mr-1 text-primary-500"></i>
                            Create a new collection to organize your favorites
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="New collection name"
                              value={newCollectionName}
                              onChange={(e) => setNewCollectionName(e.target.value)}
                              className="h-8 text-sm pl-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <i className="fas fa-folder-plus"></i>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={handleCreateCollection}
                              disabled={!newCollectionName.trim()}
                              className="bg-primary-600 hover:bg-primary-700 transition-colors shadow-md"
                            >
                              <i className="fas fa-plus mr-1"></i> Create
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                {listing.additionalImages && listing.additionalImages.length > 0 && (
                  <>
                    <button 
                      onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : 0))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button 
                      onClick={() => setActiveImage(prev => (prev < (listing.additionalImages?.length || 0) - 1 ? prev + 1 : (listing.additionalImages?.length || 0) - 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}
              </div>
              
              {listing.additionalImages && listing.additionalImages.length > 0 && (
                <div className="flex p-4 overflow-x-auto space-x-4">
                  <div 
                    onClick={() => setActiveImage(-1)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer ${activeImage === -1 ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'} transition-all`}
                  >
                    <img src={listing.imageUrl} alt="Main" className="w-full h-full object-cover" />
                  </div>
                  
                  {listing.additionalImages.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer ${activeImage === index ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'} transition-all`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b border-gray-200">
                <TabsList className="w-full justify-start px-0 pt-0 mb-2 bg-transparent">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  {isFavorite(listing.id) && <TabsTrigger value="notes">My Notes</TabsTrigger>}
                  {landlord && <TabsTrigger value="contact">Contact</TabsTrigger>}
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
                <p className="text-gray-700 mb-4">
                  {listing.detailedDescription || listing.description}
                </p>
                
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-bed text-primary-600 text-lg"></i>
                    </div>
                    <h3 className="font-medium text-gray-900">{listing.bedrooms}</h3>
                    <p className="text-gray-500 text-sm">{listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-bath text-primary-600 text-lg"></i>
                    </div>
                    <h3 className="font-medium text-gray-900">{typeof listing.bathrooms === 'number' ? listing.bathrooms : 'Shared'}</h3>
                    <p className="text-gray-500 text-sm">{bathroomText}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-ruler-combined text-primary-600 text-lg"></i>
                    </div>
                    <h3 className="font-medium text-gray-900">{listing.squareFeet}</h3>
                    <p className="text-gray-500 text-sm">Square Feet</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-university text-primary-600 text-lg"></i>
                    </div>
                    <h3 className="font-medium text-gray-900">{listing.distanceFromCampus || 'Near'}</h3>
                    <p className="text-gray-500 text-sm">From Campus</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">PROPERTY TYPE</h3>
                      <p className="mt-1 text-gray-900">{listing.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">BEDROOMS</h3>
                      <p className="mt-1 text-gray-900">{listing.bedrooms}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">BATHROOMS</h3>
                      <p className="mt-1 text-gray-900">{bathroomText}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">SQUARE FEET</h3>
                      <p className="mt-1 text-gray-900">{listing.squareFeet}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">LEASE TERM</h3>
                      <p className="mt-1 text-gray-900">{listing.leaseTerm || 'Contact for details'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">AVAILABLE FROM</h3>
                      <p className="mt-1 text-gray-900">
                        {listing.availableFrom
                          ? new Date(listing.availableFrom).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Contact for details'
                        }
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">PETS ALLOWED</h3>
                      <p className="mt-1 text-gray-900">{listing.petsAllowed ? 'Yes' : listing.petsAllowed === false ? 'No' : 'Contact for details'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">FURNISHED</h3>
                      <p className="mt-1 text-gray-900">{listing.furnished ? 'Yes' : listing.furnished === false ? 'No' : 'Contact for details'}</p>
                    </div>
                  </div>
                </div>
                
                {listing.utilitiesIncluded && listing.utilitiesIncluded.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Utilities Included</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.utilitiesIncluded.map((utility, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          <i className="fas fa-check mr-1"></i> {utility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="amenities" className="pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities & Features</h2>
                
                {listing.amenities && listing.amenities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <i className={`fas ${getAmenityIcon(amenity)} text-primary-600`}></i>
                        </div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Amenities information not available. Please contact the landlord for details.</p>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                
                <div className="mb-6">
                  <div className="bg-gray-200 rounded-lg h-48 overflow-hidden flex items-center justify-center mb-3">
                    <div className="text-gray-500">
                      <i className="fas fa-map-marker-alt text-3xl mb-2"></i>
                      <p>Map view not available in the demo</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700">
                    {listing.address || listing.location}
                  </p>
                  
                  {listing.distanceFromCampus && (
                    <div className="mt-2 flex items-center text-gray-600">
                      <i className="fas fa-university mr-1.5"></i>
                      <span>{listing.distanceFromCampus} from campus</span>
                    </div>
                  )}
                </div>
                
                {listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">What's Nearby</h3>
                    <ul className="space-y-2">
                      {listing.nearbyPlaces.map((place, index) => (
                        <li key={index} className="flex items-start">
                          <i className="fas fa-location-dot mt-1 mr-2 text-primary-600"></i>
                          <span className="text-gray-700">{place}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              {isFavorite(listing.id) && (
                <TabsContent value="notes" className="pt-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">My Notes</h2>
                  
                  {isEditingNote ? (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Write your notes about this property here..."
                        className="min-h-[150px]"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => {
                          setNoteText(getFavoriteNote(listing.id) || '');
                          setIsEditingNote(false);
                        }} className="flex items-center">
                          <i className="fas fa-times mr-2"></i> Cancel
                        </Button>
                        <Button onClick={handleSaveNote} className="flex items-center">
                          <i className="fas fa-save mr-2"></i> Save Notes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg min-h-[150px] border border-gray-200">
                        {noteText ? (
                          <p className="text-gray-700 whitespace-pre-wrap">{noteText}</p>
                        ) : (
                          <p className="text-gray-400 italic">No notes yet. Click "Edit Notes" to add your thoughts about this property.</p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => setIsEditingNote(true)}>
                          <i className="fas fa-edit mr-2"></i> Edit Notes
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Collections</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Object.keys(collections).length > 0 ? (
                          Object.entries(collections).map(([name, listings]) => (
                            listings.some(item => item.id === listing.id) && (
                              <div key={name} className="bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm flex items-center">
                                <i className="fas fa-folder-open mr-1.5"></i>
                                {name}
                              </div>
                            )
                          ))
                        ) : (
                          <p className="text-gray-400 italic">Not added to any collections yet.</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-folder-plus mr-1.5"></i> Add to Collection
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Add to Collection</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {Object.keys(collections).map((collectionName) => (
                              <DropdownMenuItem 
                                key={collectionName}
                                onClick={() => addToCollection(collectionName, listing)}
                              >
                                <i className="fas fa-folder-open mr-2 text-primary-500"></i>
                                {collectionName}
                              </DropdownMenuItem>
                            ))}
                            
                            <DropdownMenuSeparator />
                            <div className="p-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="New collection name"
                                  value={newCollectionName}
                                  onChange={(e) => setNewCollectionName(e.target.value)}
                                  className="h-8 text-sm"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={handleCreateCollection}
                                  disabled={!newCollectionName.trim()}
                                >
                                  <i className="fas fa-plus"></i>
                                </Button>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {landlord && (
                <TabsContent value="contact" className="pt-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Landlord</h2>
                  
                  <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img src={landlord.profileImage} alt={landlord.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{landlord.name}</h3>
                      <p className="text-gray-600">{landlord.email}</p>
                      <p className="text-gray-600">{landlord.phoneNumber}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center text-sm text-primary-700">
                          <i className="fas fa-clock mr-1"></i> Response time: {landlord.responseTime}
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <div className="flex items-center text-sm text-primary-700">
                          <i className="fas fa-chart-bar mr-1"></i> Response rate: {landlord.responseRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <Button className="w-full">
                      <i className="fas fa-message mr-2"></i> Send Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <i className="fas fa-phone mr-2"></i> Call Landlord
                    </Button>
                    <Button variant="outline" className="w-full">
                      <i className="fas fa-calendar-alt mr-2"></i> Schedule a Tour
                    </Button>
                  </div>
                  
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                    <div className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-2 text-primary-700 flex-shrink-0">
                        <i className="fas fa-shield-alt text-lg"></i>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-primary-800 mb-1">Secure Messaging</h3>
                        <p className="text-primary-700 text-sm">For your safety, always communicate and make payments through our platform. This helps protect you from scams and ensures a secure rental process.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex justify-end mt-8 border-t pt-6">
              <Button 
                onClick={() => setIsDetailsOpen(false)}
                variant="outline" 
                className="mr-2 flex items-center"
              >
                <i className="fas fa-times-circle mr-2"></i> Close
              </Button>
              <Button onClick={toggleFavorite}>
                {isFavorite(listing.id) ? (
                  <><i className="fas fa-heart-broken mr-2"></i> Remove from Favorites</>
                ) : (
                  <><i className="fas fa-heart mr-2"></i> Add to Favorites</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListingCard;

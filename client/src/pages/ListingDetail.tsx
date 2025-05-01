import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listings, landlords } from '@/lib/data';

const ListingDetail = () => {
  const [match, params] = useRoute('/listings/:id');
  const [listing, setListing] = useState<any>(null);
  const [landlord, setLandlord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Tabs
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params && params.id) {
      // Simulate loading
      setIsLoading(true);
      
      // Find the listing
      const foundListing = listings.find(l => l.id === params.id);
      
      if (foundListing) {
        setListing(foundListing);
        // If the listing has a landlord, find them
        if (foundListing.landlordId) {
          const foundLandlord = landlords.find(l => l.id === foundListing.landlordId);
          setLandlord(foundLandlord || null);
        }
        setIsFavorite(foundListing.favorite || false);
      }
      
      // Simulated API delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [params]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="pt-32 pb-20 flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="fas fa-home text-gray-400 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
          <p className="text-gray-600 mb-8">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/listings">
            <Button>View All Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format bathroom display text
  const bathroomText = typeof listing.bathrooms === 'number' 
    ? `${listing.bathrooms} ${listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}` 
    : 'Shared Bathroom';

  return (
    <div className="pt-32 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/">
                <div className="hover:text-primary-700 cursor-pointer">Home</div>
              </Link>
            </li>
            <li><i className="fas fa-chevron-right text-xs"></i></li>
            <li>
              <Link href="/listings">
                <div className="hover:text-primary-700 cursor-pointer">Listings</div>
              </Link>
            </li>
            <li><i className="fas fa-chevron-right text-xs"></i></li>
            <li className="text-primary-700 font-medium truncate max-w-[180px]">{listing.title}</li>
          </ol>
        </nav>

        {/* Property Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative h-96">
                <img 
                  src={listing.additionalImages?.[activeImage] || listing.imageUrl} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className={`${isFavorite ? 'fas text-red-500' : 'far text-gray-600'} fa-heart`}></i>
                  </button>
                  <button className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                    <i className="fas fa-share-alt text-gray-600"></i>
                  </button>
                </div>
                
                {listing.additionalImages && listing.additionalImages.length > 0 && (
                  <>
                    <button 
                      onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : listing.additionalImages.length))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button 
                      onClick={() => setActiveImage(prev => (prev < listing.additionalImages.length - 1 ? prev + 1 : 0))}
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
                    className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer ${activeImage === -1 ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'} transition-all`}
                  >
                    <img src={listing.imageUrl} alt="Main" className="w-full h-full object-cover" />
                  </div>
                  
                  {listing.additionalImages.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer ${activeImage === index ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'} transition-all`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <div className="border-b border-gray-200">
                  <TabsList className="w-full justify-start px-6 pt-4 bg-white">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="p-6">
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
                
                <TabsContent value="details" className="p-6">
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
                
                <TabsContent value="amenities" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities & Features</h2>
                  
                  {listing.amenities && listing.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {listing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <i className="fas fa-check text-primary-600"></i>
                          </div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Amenities information not available. Please contact the landlord for details.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="location" className="p-6">
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
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Contact Landlord Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact {landlord ? landlord.name : 'Landlord'}</h2>
              
              {landlord && (
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img src={landlord.profileImage} alt={landlord.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{landlord.name}</h3>
                    <p className="text-gray-500 text-sm">Response rate: {landlord.responseRate}%</p>
                    <p className="text-gray-500 text-sm">Response time: {landlord.responseTime}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <Button className="w-full">
                  <i className="fas fa-comment-alt mr-2"></i> Message Landlord
                </Button>
                {landlord && (
                  <>
                    <Button variant="outline" className="w-full">
                      <i className="fas fa-phone mr-2"></i> {landlord.phoneNumber}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <i className="fas fa-envelope mr-2"></i> Send Email
                    </Button>
                  </>
                )}
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="tour-date" className="block text-sm font-medium text-gray-700 mb-1">Request a Tour</label>
                  <input 
                    type="date" 
                    id="tour-date" 
                    className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="tour-message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea 
                    id="tour-message" 
                    rows={3} 
                    className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="I'm interested in this property and would like to schedule a tour."
                  ></textarea>
                </div>
                <Button className="w-full">
                  Schedule a Tour
                </Button>
              </form>
            </div>
            
            {/* Similar Listings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar Listings</h2>
              
              <div className="space-y-4">
                {listings.filter(l => l.id !== listing.id && l.type === listing.type).slice(0, 3).map((similarListing) => (
                  <Link key={similarListing.id} href={`/listings/${similarListing.id}`}>
                    <div className="group flex border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={similarListing.imageUrl} 
                          alt={similarListing.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="font-medium text-primary-700 group-hover:text-primary-800 transition-colors line-clamp-1">{similarListing.title}</h3>
                        <p className="text-sm text-gray-500">{similarListing.location}</p>
                        <p className="text-sm font-semibold mt-1">${similarListing.price}/mo</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link href="/listings">
                  <Button variant="link" className="text-primary-700">
                    View More Listings <i className="fas fa-arrow-right ml-1"></i>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
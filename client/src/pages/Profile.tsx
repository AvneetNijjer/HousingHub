import { useState } from 'react';
import { motion } from 'framer-motion';
import { listings } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { useFavorites } from '@/hooks/use-favorites';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Listing } from '@/lib/data';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const { 
    favorites, 
    collections, 
    removeFavorite, 
    createCollection,
    addToCollection,
    removeFromCollection,
    deleteCollection 
  } = useFavorites();
  
  // Use favorites instead of mock data
  const recentlyViewed = listings.slice(3, 6);
  
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.edu',
    university: 'State University',
    graduationYear: '2025',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    joinDate: 'January 2023',
    preferences: {
      maxRent: 1000,
      housingType: ['Apartment', 'House'],
      bedrooms: '2+',
      lookingFor: 'Fall 2023 Semester',
      roommates: true
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Handle creating a new collection
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreateCollectionOpen(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Create Collection Dialog */}
        <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm text-gray-500">
                Collections help you organize your saved listings by specific categories.
              </p>
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!newCollectionName.trim()}
                onClick={handleCreateCollection}
              >
                Create Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-primary-100">{user.university} • {user.graduationYear}</p>
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="p-6">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="text-gray-900 font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Member Since</span>
                      <span className="text-gray-900 font-medium">{user.joinDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Housing Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Rent</span>
                      <span className="text-gray-900 font-medium">${user.preferences.maxRent}/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Housing Type</span>
                      <span className="text-gray-900 font-medium">{user.preferences.housingType.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bedrooms</span>
                      <span className="text-gray-900 font-medium">{user.preferences.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Looking For</span>
                      <span className="text-gray-900 font-medium">{user.preferences.lookingFor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Roommates</span>
                      <span className="text-gray-900 font-medium">{user.preferences.roommates ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <i className="fas fa-cog mr-2"></i> Account Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <i className="fas fa-bell mr-2"></i> Notifications
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <i className="fas fa-lock mr-2"></i> Privacy & Security
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="saved" className="w-full" onValueChange={setActiveTab}>
                <div className="border-b border-gray-200">
                  <div className="px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="saved">Saved Listings</TabsTrigger>
                      <TabsTrigger value="collections">Collections</TabsTrigger>
                      <TabsTrigger value="viewed">Recently Viewed</TabsTrigger>
                      <TabsTrigger value="alerts">Alerts</TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                
                <TabsContent value="saved" className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Saved Listings ({favorites.length})</h2>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-sort-amount-down mr-2"></i> Sort
                    </Button>
                  </div>
                  
                  {favorites.length > 0 ? (
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {favorites.map((listing) => (
                        <motion.div 
                          key={listing.id}
                          variants={itemVariants}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/3 relative">
                              <img 
                                src={listing.imageUrl}
                                alt={listing.title}
                                className="h-48 sm:h-full w-full object-cover"
                              />
                              <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm hover:shadow transition">
                                <i className="fas fa-heart"></i>
                              </button>
                            </div>
                            <div className="sm:w-2/3 p-4">
                              <div className="flex justify-between">
                                <div>
                                  <Link href={`/listings/${listing.id}`}>
                                    <div className="text-lg font-semibold text-primary-700 cursor-pointer hover:text-primary-800">{listing.title}</div>
                                  </Link>
                                  <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-primary-800">${listing.price}/mo</div>
                                  <div className="text-gray-500 text-sm">{listing.type}</div>
                                </div>
                              </div>
                              
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <i className="fas fa-bed text-gray-500 mr-1.5"></i>
                                  {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <i className="fas fa-bath text-gray-500 mr-1.5"></i>
                                  {typeof listing.bathrooms === 'number' ? `${listing.bathrooms} Bath${listing.bathrooms !== 1 ? 's' : ''}` : 'Shared Bath'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <i className="fas fa-ruler-combined text-gray-500 mr-1.5"></i>
                                  {listing.squareFeet} sq ft
                                </span>
                              </div>
                              
                              <p className="mt-3 text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                              
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="flex items-center">
                                    <i className="fas fa-share-alt mr-1.5 text-primary-600"></i> Share
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-500"
                                    onClick={() => removeFavorite(listing.id)}
                                  >
                                    <i className="fas fa-heart-broken mr-1.5"></i> Unsave
                                  </Button>
                                </div>
                                <Link href={`/listings/${listing.id}`}>
                                  <Button size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-heart text-gray-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No saved listings yet</h3>
                      <p className="text-gray-500 mb-6">When you find a place you like, click the heart icon to save it for later.</p>
                      <Link href="/listings">
                        <Button>Browse Listings</Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="collections" className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">My Collections</h2>
                    <Button onClick={() => setIsCreateCollectionOpen(true)}>
                      <i className="fas fa-folder-plus mr-2"></i> New Collection
                    </Button>
                  </div>
                  
                  {Object.keys(collections).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(collections).map(([name, listings]) => (
                        <div key={name} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                            <div className="flex items-center">
                              <i className="fas fa-folder-open text-primary-500 mr-2"></i>
                              <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                              <span className="ml-2 text-sm text-gray-500">({listings.length} {listings.length === 1 ? 'listing' : 'listings'})</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedCollection(name)}>
                                <i className="fas fa-eye mr-1.5"></i> View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => deleteCollection(name)}
                              >
                                <i className="fas fa-trash-alt mr-1.5"></i> Delete
                              </Button>
                            </div>
                          </div>
                          
                          {selectedCollection === name && (
                            <div className="p-4">
                              {listings.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {listings.map(listing => (
                                    <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                                      <div className="h-40 relative">
                                        <img 
                                          src={listing.imageUrl} 
                                          alt={listing.title}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 flex items-end">
                                          <div className="p-3 text-white">
                                            <h4 className="font-medium">{listing.title}</h4>
                                            <p className="text-sm">${listing.price}/mo</p>
                                          </div>
                                        </div>
                                        <Button 
                                          variant="destructive" 
                                          size="icon" 
                                          className="absolute top-2 right-2 h-7 w-7 rounded-full"
                                          onClick={() => removeFromCollection(name, listing.id)}
                                        >
                                          <i className="fas fa-times text-xs"></i>
                                        </Button>
                                      </div>
                                      <div className="p-3 flex-grow bg-white">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {listing.bedrooms} Beds
                                          </span>
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {typeof listing.bathrooms === 'number' ? `${listing.bathrooms} Baths` : 'Shared Bath'}
                                          </span>
                                        </div>
                                        <Link href={`/listings/${listing.id}`}>
                                          <Button size="sm" className="w-full">View Details</Button>
                                        </Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">No listings in this collection yet.</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-folder-open text-gray-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
                      <p className="text-gray-500 mb-6">Create collections to organize your favorite listings by category (e.g., "Near Campus", "Under $1000", "With Parking").</p>
                      <Button onClick={() => setIsCreateCollectionOpen(true)}>
                        <i className="fas fa-folder-plus mr-2"></i> Create Your First Collection
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="viewed" className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recently Viewed ({recentlyViewed.length})</h2>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-trash-alt mr-2"></i> Clear History
                    </Button>
                  </div>
                  
                  {recentlyViewed.length > 0 ? (
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {recentlyViewed.map((listing) => (
                        <motion.div 
                          key={listing.id}
                          variants={itemVariants}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/3 relative">
                              <img 
                                src={listing.imageUrl}
                                alt={listing.title}
                                className="h-48 sm:h-full w-full object-cover"
                              />
                              <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm hover:shadow hover:text-red-500 transition">
                                <i className="far fa-heart"></i>
                              </button>
                            </div>
                            <div className="sm:w-2/3 p-4">
                              <div className="flex justify-between">
                                <div>
                                  <Link href={`/listings/${listing.id}`}>
                                    <div className="text-lg font-semibold text-primary-700 cursor-pointer hover:text-primary-800">{listing.title}</div>
                                  </Link>
                                  <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-primary-800">${listing.price}/mo</div>
                                  <div className="text-gray-500 text-sm">{listing.type}</div>
                                </div>
                              </div>
                              
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <i className="fas fa-bed text-gray-500 mr-1.5"></i>
                                  {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <i className="fas fa-bath text-gray-500 mr-1.5"></i>
                                  {typeof listing.bathrooms === 'number' ? `${listing.bathrooms} Bath${listing.bathrooms !== 1 ? 's' : ''}` : 'Shared Bath'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <i className="fas fa-ruler-combined text-gray-500 mr-1.5"></i>
                                  {listing.squareFeet} sq ft
                                </span>
                              </div>
                              
                              <p className="mt-3 text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                              
                              <div className="mt-4 flex justify-end">
                                <Link href={`/listings/${listing.id}`}>
                                  <Button size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-history text-gray-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No recently viewed listings</h3>
                      <p className="text-gray-500 mb-6">When you view a listing, it will appear here for easy access.</p>
                      <Link href="/listings">
                        <Button>Browse Listings</Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="alerts" className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Alerts</h2>
                    <Button>
                      <i className="fas fa-plus mr-2"></i> Create Alert
                    </Button>
                  </div>
                  
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-100 mb-6">
                    <div className="flex items-start">
                      <div className="bg-primary-100 rounded-full p-2 text-primary-700">
                        <i className="fas fa-info-circle text-lg"></i>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-primary-800 mb-1">What are Alerts?</h3>
                        <p className="text-primary-700 text-sm">Get notified when new listings match your criteria. Create an alert based on your search preferences, and we'll email you when new properties become available.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-bell text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts set up yet</h3>
                    <p className="text-gray-500 mb-6">Create alerts to be notified when new listings match your criteria.</p>
                    <Button>
                      <i className="fas fa-plus mr-2"></i> Create Your First Alert
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
            
            {/* Recommended Listings */}
            <motion.div 
              className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended For You</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listings.slice(6, 8).map((listing, index) => (
                    <motion.div 
                      key={listing.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 * index + 0.5 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <img 
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 flex items-end">
                          <div className="p-4 text-white">
                            <h3 className="font-semibold">{listing.title}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-white/90 text-sm">{listing.location}</p>
                              <p className="font-bold">${listing.price}/mo</p>
                            </div>
                          </div>
                        </div>
                        <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm hover:shadow hover:text-red-500 transition">
                          <i className="far fa-heart"></i>
                        </button>
                      </div>
                      <div className="p-3">
                        <div className="flex gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {listing.bedrooms} Beds
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {typeof listing.bathrooms === 'number' ? `${listing.bathrooms} Baths` : 'Shared Bath'}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {listing.type}
                          </span>
                        </div>
                        <Link href={`/listings/${listing.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Link href="/listings">
                    <Button variant="link" className="text-primary-700">
                      View More Recommendations <i className="fas fa-arrow-right ml-1"></i>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
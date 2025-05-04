import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavoritesContext } from '@/hooks/use-favorites';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Listing } from '@/lib/data';

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
  } = useFavoritesContext();
  
  const [showDetails, setShowDetails] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [note, setNote] = useState(getFavoriteNote(listing.id) || '');
  const [newCollection, setNewCollection] = useState('');
  
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorite(listing.id)) {
        await removeFavorite(listing.id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(listing.id);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };
  
  const handleSaveNote = async () => {
    try {
      await addNoteToFavorite(listing.id, note);
      toast.success('Note saved');
      setShowDetails(false);
    } catch (error) {
      toast.error('Failed to save note');
    }
  };
  
  const handleCreateCollection = async () => {
    if (!newCollection.trim()) return;
    
    try {
      await createCollection(newCollection);
      await addToCollection(newCollection, listing.id);
      toast.success(`Added to ${newCollection}`);
      setNewCollection('');
      setShowCollectionDialog(false);
    } catch (error) {
      toast.error('Failed to create collection');
    }
  };

  // Function to get badge color based on property type
  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return 'bg-blue-100 text-blue-800';
      case 'house':
        return 'bg-green-100 text-green-800';
      case 'condo':
        return 'bg-purple-100 text-purple-800';
      case 'townhouse':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return '📶';
      case 'laundry':
        return '🧺';
      case 'parking':
        return '🅿️';
      case 'furnished':
        return '🛋️';
      case 'pets allowed':
        return '🐾';
      case 'gym':
        return '💪';
      case 'pool':
        return '🏊‍♂️';
      case 'security':
        return '🔒';
      default:
        return '✨';
    }
  };

  // Format bathroom display text
  const bathroomText = (bathrooms: number | 'Shared') => {
    if (bathrooms === 'Shared') return 'Shared bathroom';
    if (bathrooms === 1) return '1 bathroom';
    if (typeof bathrooms === 'number' && bathrooms % 1 === 0) return `${bathrooms} bathrooms`;
    return `${bathrooms} bathrooms`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative">
        <img 
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            {isFavorite(listing.id) ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(listing.type)}`}>
            {listing.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
          <p className="text-lg font-bold text-primary-600">${listing.price}/mo</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{listing.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bed' : 'beds'}</span>
          <span>•</span>
          <span>{bathroomText(listing.bathrooms)}</span>
          {listing.squareFeet && (
            <>
              <span>•</span>
              <span>{listing.squareFeet} sq ft</span>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {getAmenityIcon(amenity)} {amenity}
            </span>
          ))}
          {listing.amenities.length > 4 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{listing.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setShowDetails(true)}>
            View Details
          </Button>
          <Link href={`/listings/${listing.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
            Contact
          </Link>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{listing.title}</DialogTitle>
            <DialogDescription>
              {listing.type} {listing.address ? `in ${listing.address}` : ''}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Property Details</h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li>Price: ${listing.price}/month</li>
                    <li>Bedrooms: {listing.bedrooms}</li>
                    <li>Bathrooms: {listing.bathrooms}</li>
                    {listing.squareFeet && <li>Square Feet: {listing.squareFeet}</li>}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li>{listing.address}</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Amenities</h4>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {listing.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center text-sm text-gray-600"
                    >
                      {getAmenityIcon(amenity)} {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Description</h4>
                <p className="mt-2 text-sm text-gray-600">{listing.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(listing.additionalImages) && listing.additionalImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {listing.additionalImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Additional ${index + 1}`}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Note
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write your notes about this listing..."
                  rows={4}
                />
                <Button
                  onClick={handleSaveNote}
                  className="mt-2"
                >
                  Save Note
                </Button>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Add to Collection</h4>
                <div className="flex gap-2 flex-wrap">
                  {collections.map((collection) => (
                    <Button
                      key={collection}
                      variant="outline"
                      onClick={async () => {
                        try {
                          await addToCollection(collection, listing.id);
                          toast.success(`Added to ${collection}`);
                        } catch (error) {
                          toast.error('Failed to add to collection');
                        }
                      }}
                    >
                      {collection}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setShowCollectionDialog(true)}
                  >
                    + New Collection
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <Input
                value={newCollection}
                onChange={(e) => setNewCollection(e.target.value)}
                placeholder="e.g., Favorites, Shortlist, etc."
              />
            </div>
            <Button
              onClick={handleCreateCollection}
            >
              Create & Add Listing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ListingCard;

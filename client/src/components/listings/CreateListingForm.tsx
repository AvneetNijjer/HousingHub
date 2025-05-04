import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useListings } from '@/hooks/use-listings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Listing } from '@shared/schema';

interface CreateListingFormProps {
  initialData?: Partial<Listing>;
  mode?: 'create' | 'edit';
}

interface FormData {
  title: string;
  description: string;
  price: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const CreateListingForm = ({ initialData, mode = 'create' }: CreateListingFormProps) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { createListing, updateListing } = useListings();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);

  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    propertyType: initialData?.propertyType || 'apartment',
    bedrooms: initialData?.bedrooms?.toString() || '',
    bathrooms: initialData?.bathrooms?.toString() || '',
    squareFeet: initialData?.squareFeet?.toString() || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setLoading(true);
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('listings')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('listings')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a listing');
      return;
    }

    // Validate required fields
    const requiredFields = ['title', 'price', 'propertyType', 'bedrooms', 'bathrooms', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate numeric fields
    const numericFields = ['price', 'bedrooms', 'bathrooms', 'squareFeet'];
    const invalidFields = numericFields.filter(field => {
      const value = formData[field as keyof FormData];
      return value && isNaN(Number(value));
    });

    if (invalidFields.length > 0) {
      toast.error(`Invalid numeric values in: ${invalidFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : undefined,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        amenities,
        images,
        isAvailable: true,
        userId: user.id,
      } satisfies Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>;

      if (mode === 'create') {
        await createListing.mutateAsync(listingData);
        toast.success('Listing created successfully');
      } else if (initialData?.id) {
        await updateListing.mutateAsync({ id: initialData.id, ...listingData });
        toast.success('Listing updated successfully');
      } else {
        throw new Error('No listing ID provided for update');
      }
      setLocation('/profile/my-listings');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save listing');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Modern Campus View Apartment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per month</label>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            placeholder="850"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => handleSelectChange('propertyType', value as FormData['propertyType'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <Input
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleInputChange}
            required
            min="1"
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <Input
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleInputChange}
            required
            min="0.5"
            step="0.5"
            placeholder="1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
          <Input
            name="squareFeet"
            type="number"
            value={formData.squareFeet}
            onChange={handleInputChange}
            min="0"
            placeholder="750"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="123 University Ave"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            placeholder="College Town"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            placeholder="ST"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
          <Input
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
            placeholder="12345"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          placeholder="Describe your property..."
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mb-2"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url}
                alt={`Listing image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['WiFi', 'Laundry', 'Parking', 'Furnished', 'Pets Allowed', 'Gym', 'Pool', 'Security'].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={amenities.includes(amenity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setAmenities(prev => [...prev, amenity]);
                  } else {
                    setAmenities(prev => prev.filter(a => a !== amenity));
                  }
                }}
              />
              <label htmlFor={amenity} className="text-sm text-gray-700">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : mode === 'create' ? 'Create Listing' : 'Update Listing'}
      </Button>
    </form>
  );
};

export default CreateListingForm; 
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useListings } from '@/hooks/use-listings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Listing } from '@/lib/data';
import { uploadImage, getImageUrl } from '@/lib/storage';

const propertyTypes = ['Apartment', 'House', 'Dormitory', 'Studio'] as const;
const amenitiesList = ['WiFi', 'Laundry', 'Furnished', 'Parking', 'Pets Allowed', 'Gym', 'Pool', 'Security'];

type FormData = {
  title: string;
  description: string;
  price: string;
  type: typeof propertyTypes[number];
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  address: string;
  location: string;
  amenities: string[];
  images: File[];
  availableFrom: string;
  leaseTerm: string;
  petsAllowed: boolean;
  furnished: boolean;
  utilitiesIncluded: string;
};

interface CreateListingFormProps {
  initialData?: Partial<Listing>;
  mode?: 'create' | 'edit';
}

const CreateListingForm = ({ initialData, mode = 'create' }: CreateListingFormProps) => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { createListing, updateListing } = useListings();
  const [form, setForm] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    type: (initialData?.type as typeof propertyTypes[number]) || 'Apartment',
    bedrooms: initialData?.bedrooms?.toString() || '',
    bathrooms: initialData?.bathrooms?.toString() || '',
    squareFeet: initialData?.squareFeet?.toString() || '',
    address: initialData?.address || '',
    location: initialData?.location || '',
    amenities: initialData?.amenities || [],
    images: [],
    availableFrom: initialData?.availableFrom || '',
    leaseTerm: initialData?.leaseTerm || '',
    petsAllowed: initialData?.petsAllowed || false,
    furnished: initialData?.furnished || false,
    utilitiesIncluded: initialData?.utilitiesIncluded?.join(', ') || '',
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setForm(prev => ({ ...prev, images: files }));
      setImagePreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a listing');
      return;
    }

    // Validate required fields
    const requiredFields = ['title', 'price', 'type', 'bedrooms', 'bathrooms', 'address', 'location'];
    const missingFields = requiredFields.filter(field => !form[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate numeric fields
    const numericFields = ['price', 'bedrooms', 'bathrooms', 'squareFeet'];
    const invalidFields = numericFields.filter(field => {
      const value = form[field as keyof FormData];
      return value && isNaN(Number(value));
    });

    if (invalidFields.length > 0) {
      toast.error(`Invalid numeric values in: ${invalidFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Upload images to Supabase Storage
      let imageUrls: string[] = [];
      if (form.images.length > 0) {
        for (const file of form.images) {
          const path = `public/${user?.id}/${Date.now()}-${file.name}`;
          await uploadImage(file, 'listing-images', path);
          const publicUrl = getImageUrl('listing-images', path);
          imageUrls.push(publicUrl);
        }
      }

      // Insert listing into Supabase
      const listingData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        type: form.type,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseFloat(form.bathrooms),
        squareFeet: form.squareFeet ? parseInt(form.squareFeet) : 0,
        address: form.address,
        location: form.location,
        amenities: form.amenities,
        imageUrl: imageUrls[0] || initialData?.imageUrl || '',
        additionalImages: imageUrls.length > 0 ? imageUrls.slice(1) : initialData?.additionalImages || [],
        availableFrom: form.availableFrom || undefined,
        leaseTerm: form.leaseTerm || undefined,
        petsAllowed: form.petsAllowed,
        furnished: form.furnished,
        utilitiesIncluded: form.utilitiesIncluded ? form.utilitiesIncluded.split(',').map(s => s.trim()) : [],
        user_id: user?.id,
      } satisfies Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>;

      if (mode === 'edit' && initialData?.id) {
        await updateListing.mutateAsync({ id: initialData.id, ...listingData });
        toast.success('Listing updated successfully');
      } else {
        await createListing.mutateAsync(listingData);
        toast.success('Listing created successfully');
      }
      setLocation('/profile/my-listings');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mt-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Create a New Listing</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per month</label>
            <Input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" placeholder="850" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <Select
              value={form.type}
              onValueChange={(value: typeof propertyTypes[number]) => setForm(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <Input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} required min="1" placeholder="2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <Input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} required min="0.5" step="0.5" placeholder="1.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
            <Input name="squareFeet" type="number" value={form.squareFeet} onChange={handleChange} min="0" placeholder="750" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input name="address" value={form.address} onChange={handleChange} required placeholder="123 University Ave" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <Input name="location" value={form.location} onChange={handleChange} required placeholder="College Town" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe your property..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {imagePreviews.map((url, idx) => (
              <img key={idx} src={url} alt={`Preview ${idx + 1}`} className="rounded-lg object-cover w-full h-32" />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map(amenity => (
              <label key={amenity} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Available From</label>
            <Input name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lease Term</label>
            <Input name="leaseTerm" value={form.leaseTerm} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pets Allowed</label>
            <Checkbox checked={form.petsAllowed} onCheckedChange={checked => setForm(prev => ({ ...prev, petsAllowed: !!checked }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Furnished</label>
            <Checkbox checked={form.furnished} onCheckedChange={checked => setForm(prev => ({ ...prev, furnished: !!checked }))} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Utilities Included (comma separated)</label>
          <Input name="utilitiesIncluded" value={form.utilitiesIncluded} onChange={handleChange} />
        </div>
        <Button type="submit" disabled={loading} className="w-full mt-4">
          {loading ? 'Creating...' : 'Create Listing'}
        </Button>
      </form>
    </div>
  );
};

export default CreateListingForm; 
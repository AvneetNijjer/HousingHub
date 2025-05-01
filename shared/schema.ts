import { z } from "zod";

// User Schema
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profilePicture: z.string().url().optional(),
  isVerified: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Listing Schema
export const listingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().positive(),
  squareFeet: z.number().int().positive().optional(),
  propertyType: z.enum(['apartment', 'house', 'condo', 'townhouse']),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  isAvailable: z.boolean().default(true),
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Favorite Schema
export const favoriteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  listingId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

// Message Schema
export const messageSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  listingId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  isRead: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

// Types
export type User = z.infer<typeof userSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type Favorite = z.infer<typeof favoriteSchema>;
export type Message = z.infer<typeof messageSchema>;

// Database Tables
export const tables = {
  users: 'users',
  listings: 'listings',
  favorites: 'favorites',
  messages: 'messages',
} as const;

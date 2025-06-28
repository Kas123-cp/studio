import { z } from 'zod';

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  condition: 'New' | 'Used' | 'Refurbished';
  images: string[];
  specs: {
    processor: string;
    ram: string;
    storage: string;
    display: string;
    battery: string;
  };
  description: string;
  featured?: boolean;
  newArrival?: boolean;
  createdAt?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  brand: z.string().min(2, "Brand is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  condition: z.enum(['New', 'Used', 'Refurbished']),
  images: z.array(z.any())
    .refine((files) => files.length > 0, "Please upload at least one image.")
    .refine((files) => files.every((file) => file instanceof File), "Expected a file.")
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  description: z.string().min(10, "Description is required"),
  specs: z.object({
    processor: z.string().min(3, "Processor is required"),
    ram: z.string().min(3, "RAM is required"),
    storage: z.string().min(3, "Storage is required"),
    display: z.string().min(3, "Display is required"),
    battery: z.string().min(3, "Battery info is required"),
  }),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
});

export type FormState = {
    message: string;
    errors?: Record<string, string[] | undefined> | undefined;
} | undefined;

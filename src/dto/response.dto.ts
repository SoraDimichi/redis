import { z } from 'zod';

export const ProductDimensionsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  depth: z.number().positive(),
});

export const ProductReviewSchema = z.object({
  rating: z.number().min(0),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string(),
});

export const ProductMetaSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  barcode: z.string(),
  qrCode: z.string(),
});

export const ProductResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number().min(0),
  discountPercentage: z.number().min(0),
  rating: z.number().min(0),
  stock: z.number().min(0),
  brand: z.string(),
  category: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  sku: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: ProductDimensionsSchema.optional(),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  availabilityStatus: z.string().optional(),
  reviews: z.array(ProductReviewSchema).optional(),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.number().min(1).optional(),
  meta: ProductMetaSchema.optional(),
  isDeleted: z.boolean().optional(),
  deletedOn: z.string().optional(),
});

export const ProductsResponseSchema = z.object({
  products: z.array(ProductResponseSchema),
  total: z.number().min(0),
  skip: z.number().min(0),
  limit: z.number().min(0),
});

export const Category = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
});

export const StringArraySchema = z.array(z.string());

export const CategoryListSchema = z.array(Category);

import { IsString, IsNumber, IsOptional, IsArray, Min, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDimensionsDto {
  @IsNumber()
  @Min(0)
  width: number;

  @IsNumber()
  @Min(0)
  height: number;

  @IsNumber()
  @Min(0)
  depth: number;
}

export class ProductReviewDto {
  @IsNumber()
  @Min(0)
  rating: number;

  @IsString()
  comment: string;

  @IsString()
  date: string;

  @IsString()
  reviewerName: string;

  @IsString()
  reviewerEmail: string;
}

export class ProductMetaDto {
  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  barcode: string;

  @IsString()
  qrCode: string;
}

export class ProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPercentage?: number;

  @IsNumber()
  @Min(0)
  rating: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  brand: string;

  @IsString()
  category: string;

  @IsString()
  thumbnail: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductDimensionsDto)
  dimensions?: ProductDimensionsDto;

  @IsOptional()
  @IsString()
  warrantyInformation?: string;

  @IsOptional()
  @IsString()
  shippingInformation?: string;

  @IsOptional()
  @IsString()
  availabilityStatus?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductReviewDto)
  reviews?: ProductReviewDto[];

  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minimumOrderQuantity?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductMetaDto)
  meta?: ProductMetaDto;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductDimensionsDto)
  dimensions?: ProductDimensionsDto;

  @IsOptional()
  @IsString()
  warrantyInformation?: string;

  @IsOptional()
  @IsString()
  shippingInformation?: string;

  @IsOptional()
  @IsString()
  availabilityStatus?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductReviewDto)
  reviews?: ProductReviewDto[];

  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minimumOrderQuantity?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductMetaDto)
  meta?: ProductMetaDto;
}

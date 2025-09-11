import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

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
}

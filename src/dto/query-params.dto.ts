import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ParamsProducts {
  LIMIT = 'limit',
  SKIP = 'skip',
  SELECT = 'select',
  SORT_BY = 'sortBy',
  ORDER = 'order',
}

export class QueryParamsProducts {
  @IsOptional()
  @IsString()
  [ParamsProducts.SELECT]?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  [ParamsProducts.SKIP]?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  [ParamsProducts.LIMIT]?: number;

  @IsOptional()
  @IsString()
  [ParamsProducts.SORT_BY]?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  [ParamsProducts.ORDER]?: SortOrder;
}

export class QueryParamsSearch {
  @IsString()
  q: string;
}

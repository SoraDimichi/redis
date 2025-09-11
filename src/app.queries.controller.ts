import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsProvider } from './app.provider';
import { QueryParamsDto, SearchQueryParamsDto } from './dto/query-params.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CacheInterceptor)
export class ProductsQueriesController {
  constructor(private readonly productsQueriesService: ProductsProvider) {}

  @Get()
  async getAllProducts(@Query() query: QueryParamsDto) {
    try {
      return await this.productsQueriesService.getAllProducts(query);
    } catch {
      throw new HttpException(
        `Failed to fetch products`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  async searchProducts(@Query() params: SearchQueryParamsDto) {
    try {
      return await this.productsQueriesService.searchProducts(params.q, params);
    } catch {
      throw new HttpException(
        `Failed to search products`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('categories')
  async getAllCategories() {
    try {
      return await this.productsQueriesService.getAllCategories();
    } catch {
      throw new HttpException(
        `Failed to fetch categories:`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category-list')
  async getCategoryList() {
    try {
      return await this.productsQueriesService.getCategoryList();
    } catch {
      throw new HttpException(
        `Failed to fetch category list`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:category')
  async getProductsByCategory(
    @Param('category') category: string,
    @Query() query: QueryParamsDto,
  ) {
    try {
      return await this.productsQueriesService.getProductsByCategory(
        category,
        query,
      );
    } catch {
      throw new HttpException(
        `Failed to fetch products by category`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      return await this.productsQueriesService.getProductById(id);
    } catch {
      throw new HttpException(
        `Failed to fetch product`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

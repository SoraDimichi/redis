import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './app.service';
import { QueryParamsProducts, QueryParamsSearch } from './dto/query-params.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductsQueriesController {
  constructor(private readonly productsQueriesService: ProductsService) {}

  @Get()
  async getAllProducts(@Query() query: QueryParamsProducts) {
    return this.productsQueriesService.getAllProducts(query);
  }

  @Get('search')
  async searchProducts(@Query() params: QueryParamsSearch) {
    return this.productsQueriesService.searchProducts(params);
  }

  @Get('categories')
  async getAllCategories() {
    return this.productsQueriesService.getAllCategories();
  }

  @Get('category-list')
  async getCategoryList() {
    return this.productsQueriesService.getCategoryList();
  }

  @Get('category/:category')
  async getProductsByCategory(
    @Param('category') category: string,
    @Query() query: QueryParamsProducts,
  ) {
    return this.productsQueriesService.getProductsByCategory(category, query);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsQueriesService.getProductById(id);
  }
}

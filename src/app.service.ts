import { Injectable } from '@nestjs/common';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { QueryParamsProducts, QueryParamsSearch } from './dto/query-params.dto';
import {
  ProductResponseSchema,
  ProductsResponseSchema,
  StringArraySchema,
  CategoryListSchema,
} from './dto/response.dto';
import { HttpClientProvider } from './http-client.provider';

@Injectable()
export class ProductsService {
  constructor(private readonly httpClientProvider: HttpClientProvider) {}

  async getAllProducts(params?: QueryParamsProducts) {
    return this.httpClientProvider.query(
      'products',
      ProductsResponseSchema,
      params,
    );
  }

  async getProductById(id: string) {
    return this.httpClientProvider.query(
      `products/${id}`,
      ProductResponseSchema,
    );
  }

  async searchProducts(params: QueryParamsSearch) {
    return this.httpClientProvider.query(
      'products/search',
      ProductsResponseSchema,
      params,
    );
  }

  async getAllCategories() {
    const response = await this.httpClientProvider.query(
      'products/categories',
      StringArraySchema,
    );

    return response;
  }

  async getCategoryList() {
    const response = await this.httpClientProvider.query(
      'products/category-list',
      CategoryListSchema,
    );

    return response;
  }

  async getProductsByCategory(category: string, params?: QueryParamsProducts) {
    return this.httpClientProvider.query(
      `products/category/${category}`,
      ProductsResponseSchema,
      params,
    );
  }

  async addProduct(productData: ProductDto) {
    return this.httpClientProvider.post(
      'products/add',
      ProductResponseSchema,
      productData,
    );
  }

  async updateProduct(id: string, productData: UpdateProductDto) {
    return this.httpClientProvider.put(
      `products/${id}`,
      ProductResponseSchema,
      productData,
    );
  }

  async deleteProduct(id: string) {
    return this.httpClientProvider.delete(
      `products/${id}`,
      ProductResponseSchema,
    );
  }
}

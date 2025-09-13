import { Injectable } from '@nestjs/common';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { QueryParamsProducts, QueryParamsSearch } from './dto/query-params.dto';
import { Category, Product, ProductsResponse } from './dto/types';
import { HttpClientProvider } from './http-client.provider';

@Injectable()
export class ProductsProvider {
  constructor(private readonly httpClientProvider: HttpClientProvider) {}

  async getAllProducts(params?: QueryParamsProducts) {
    return this.httpClientProvider.get<ProductsResponse>('products', params);
  }

  async getProductById(id: string) {
    return this.httpClientProvider.get<Product>(`products/${id}`);
  }

  async searchProducts(params: QueryParamsSearch) {
    return this.httpClientProvider.get<ProductsResponse>(
      'products/search',
      params,
    );
  }

  async getAllCategories() {
    return this.httpClientProvider.get<Category[]>('products/categories');
  }

  async getCategoryList(): Promise<string[]> {
    return this.httpClientProvider.get<string[]>('products/category-list');
  }

  async getProductsByCategory(category: string, params?: QueryParamsProducts) {
    return this.httpClientProvider.get<ProductsResponse>(
      `products/category/${category}`,
      params,
    );
  }

  async addProduct(productData: ProductDto) {
    return this.httpClientProvider.post<Product>('products/add', productData);
  }

  async updateProduct(id: string, productData: UpdateProductDto) {
    return this.httpClientProvider.put<Product>(`products/${id}`, productData);
  }

  async deleteProduct(id: string) {
    return this.httpClientProvider.delete<Product>(`products/${id}`);
  }
}

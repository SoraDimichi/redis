import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { Category, Product, ProductsResponse } from './dto/types';

@Injectable()
export class ProductsProvider {
  constructor(private readonly httpService: HttpService) {}

  private buildQueryParams(params?: QueryParamsDto): string {
    if (!params) return '';

    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.skip !== undefined) {
      queryParams.append('skip', params.skip.toString());
    }
    if (params.select) {
      queryParams.append('select', params.select);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.order) {
      queryParams.append('order', params.order);
    }
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getAllProducts(params?: QueryParamsDto) {
    const queryString = this.buildQueryParams(params);

    const { data } = await firstValueFrom(
      this.httpService.get<ProductsResponse>(`/products${queryString}`),
    );

    return data;
  }

  async getProductById(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<Product>(`/products/${id}`),
    );
    return data;
  }

  async searchProducts(query: string, params?: QueryParamsDto) {
    const queryParams = this.buildQueryParams(params);
    const separator = queryParams ? '&' : '?';
    const { data } = await firstValueFrom(
      this.httpService.get<ProductsResponse>(
        `/products/search${queryParams}${separator}q=${query}`,
      ),
    );
    return data;
  }

  async getAllCategories() {
    const { data } = await firstValueFrom(
      this.httpService.get<Category[]>('/products/categories'),
    );
    return data;
  }

  async getCategoryList(): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<string[]>('/products/category-list'),
    );
    return data;
  }

  async getProductsByCategory(category: string, params?: QueryParamsDto) {
    const queryString = this.buildQueryParams(params);
    const { data } = await firstValueFrom(
      this.httpService.get<ProductsResponse>(
        `/products/category/${category}${queryString}`,
      ),
    );
    return data;
  }

  async addProduct(productData: ProductDto) {
    const { data } = await firstValueFrom(
      this.httpService.post<Product>('/products/add', productData),
    );
    return data;
  }

  async updateProduct(id: string, productData: UpdateProductDto) {
    const { data } = await firstValueFrom(
      this.httpService.put<Product>(`/products/${id}`, productData),
    );
    return data;
  }

  async deleteProduct(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete<Product>(`/products/${id}`),
    );
    return data;
  }
}

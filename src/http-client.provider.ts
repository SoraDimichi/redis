import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class HttpError<T = any> extends Error {
  readonly status: number;
  readonly data: T | null;

  constructor(message: string, status: number, data: T | null = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

export interface HttpClientOptions extends RequestInit {
  baseURL?: string;
  timeout?: number;
}

@Injectable()
export class HttpClientProvider {
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(private readonly configService: ConfigService) {
    this.baseURL = this.configService.get<string>(
      'API_BASE_URL',
      'https://dummyjson.com',
    );
    this.timeout = this.configService.get<number>('API_TIMEOUT', 5000);
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new HttpError<T>(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData,
      );
    }
    return (await response.json()) as T;
  }

  private async execute<T>(
    url: string,
    options: HttpClientOptions,
  ): Promise<T> {
    const mergedOptions: HttpClientOptions = {
      ...options,
      headers: { ...this.defaultHeaders, ...options.headers },
    };

    const fullUrl = this.baseURL
      ? `${this.baseURL}${url.startsWith('/') ? url : `/${url}`}`
      : url;

    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout ?? this.timeout,
    );

    try {
      const response = await fetch(fullUrl, { ...mergedOptions, signal });
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new HttpError<T>(
          `Request timeout after ${options.timeout ?? this.timeout}ms`,
          408,
          null,
        );
      }
      if (error instanceof HttpError) throw error;
      throw new HttpError<T>(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        null,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  request<T>(url: string, options: HttpClientOptions = {}): Promise<T> {
    return this.execute<T>(url, options);
  }

  private buildQueryParams<U extends Record<string, any>>(params?: U): string {
    if (!params) return '';

    const query = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]);

    const queryParams = new URLSearchParams(query);
    const queryString = queryParams.toString();

    return queryString ? `?${queryString}` : '';
  }

  get<T, U extends Record<string, any> = Record<string, any>>(
    url: string,
    params?: U,
    options: HttpClientOptions = {},
  ): Promise<T> {
    const queryString = this.buildQueryParams(params);
    const fullUrl = `${url}${queryString}`;
    return this.request<T>(fullUrl, { ...options, method: 'GET' });
  }

  post<T>(url: string, data: any, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(url: string, data: any, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(url: string, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

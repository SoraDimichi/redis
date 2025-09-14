import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

export class ValidationException extends Error {
  constructor(
    public readonly errors: z.ZodError | Error,
    message: string = 'Validation failed',
  ) {
    super(message);
    this.name = 'ValidationException';
  }
}

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

  private validateData<T>(schema: z.ZodType<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationException(
          error,
          `Response validation failed: ${error.message}`,
        );
      }
      throw new ValidationException(
        error instanceof Error ? error : new Error(String(error)),
        'Response validation failed',
      );
    }
  }

  private async handleResponse<T>(response: Response, schema: z.ZodType<T>) {
    if (!response.ok) {
      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new HttpError<T>(
        errorData?.message || `Request failed with status ${response.status}`,
        response.status,
        errorData as T,
      );
    }

    try {
      const data: unknown = await response.json();
      return this.validateData(schema, data);
    } catch (error) {
      throw new HttpError(
        error instanceof Error ? error.message : 'Response validation failed',
        400,
      );
    }
  }

  private async request<T>(
    url: string,
    options: HttpClientOptions,
    schema: z.ZodType<T>,
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
      return await this.handleResponse(response, schema);
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

  private buildQueryParams<U extends Record<string, any>>(params?: U): string {
    if (!params) return '';

    const query = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]);

    const queryParams = new URLSearchParams(query);
    const queryString = queryParams.toString();

    return queryString ? `?${queryString}` : '';
  }

  query<T, P extends Record<string, any> = Record<string, any>>(
    url: string,
    schema: z.ZodType<T>,
    params?: P,
    options: HttpClientOptions = {},
  ): Promise<T> {
    const queryString = this.buildQueryParams(params);
    const fullUrl = `${url}${queryString}`;
    return this.request<T>(fullUrl, { ...options, method: 'GET' }, schema);
  }

  private command<T, D = Record<string, any>>(
    url: string,
    schema: z.ZodType<T>,
    options: Omit<HttpClientOptions, 'method' | 'body'> = {},
    method: 'POST' | 'PUT' | 'DELETE',
    data?: D,
  ) {
    return this.request(
      url,
      {
        ...options,
        method: method,
        body: JSON.stringify(data),
      },
      schema,
    );
  }

  post<T, D = Record<string, any>>(
    url: string,
    schema: z.ZodType<T>,
    data: D,
    options: HttpClientOptions = {},
  ) {
    return this.command(url, schema, options, 'POST', data);
  }

  put<T, D = Record<string, any>>(
    url: string,
    schema: z.ZodType<T>,
    data: D,
    options: HttpClientOptions = {},
  ) {
    return this.command(url, schema, options, 'PUT', data);
  }

  delete<T>(
    url: string,
    schema: z.ZodType<T>,
    options: HttpClientOptions = {},
  ) {
    return this.command(url, schema, options, 'DELETE');
  }
}

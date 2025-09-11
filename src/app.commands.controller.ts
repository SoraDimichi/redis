import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsProvider } from './app.provider';
import { ProductDto, UpdateProductDto } from './dto/product.dto';

@Controller()
export class ProductsCommandsController {
  constructor(private readonly productsProvider: ProductsProvider) {}

  @Post('add')
  async addProduct(@Body() productData: ProductDto) {
    try {
      return await this.productsProvider.addProduct(productData);
    } catch {
      throw new HttpException(
        `Failed to add product`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ) {
    try {
      return await this.productsProvider.updateProduct(id, productData);
    } catch {
      throw new HttpException(
        `Failed to update product`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      return await this.productsProvider.deleteProduct(id);
    } catch {
      throw new HttpException(
        `Failed to delete product`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

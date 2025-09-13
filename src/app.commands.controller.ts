import { Controller, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductsProvider } from './app.provider';
import { ProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsCommandsController {
  constructor(private readonly productsProvider: ProductsProvider) {}

  @Post('add')
  async addProduct(@Body() productData: ProductDto) {
    return this.productsProvider.addProduct(productData);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ) {
    return this.productsProvider.updateProduct(id, productData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsProvider.deleteProduct(id);
  }
}

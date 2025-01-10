import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@src/utils/authguard.guard';
import { ProductInsert } from './product.interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProductInserSwagger } from './product.swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //   @UseGuards(AuthGuard)
  @Get('/list')
  async getProduct(@Query() data: any) {
    try {
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Post('/insert')
  @ApiBody({ type: ProductInserSwagger })
  @UseInterceptors(FilesInterceptor('product_img'))
  @ApiConsumes('multipart/form-data')
  async insertProduct(
    @Body() data: ProductInsert,
    @UploadedFiles() files: File[],
  ) {
    try {
      return this.productService.insertProduct(files, data);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

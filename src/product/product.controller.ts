import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@src/utils/authguard.guard';
import { ProductInsert } from './product.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { ProductInserSwagger, ProductSelectSwagger } from './product.swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //   @UseGuards(AuthGuard)
  @ApiQuery({ type: ProductSelectSwagger })
  @Get('/list')
  async getProduct(@Query() data: any) {
    // console.log(pages);
    // console.log(page_count);
    try {
      return this.productService.getListProduct(
        data.search,
        data.pages,
        data.page_count,
      );
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Post('/insert')
  @ApiBody({ type: ProductInserSwagger })
  @UseInterceptors(FilesInterceptor('product_img_key'))
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

  @Post('/update')
  async updateProduct() {
    try {
      //
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

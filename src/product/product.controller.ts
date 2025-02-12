import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@src/utils/authguard.guard';
import {
  productDelete,
  ProductInsert,
  productUpdate,
} from './product.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ProductDeleteSwagger,
  ProductInserSwagger,
  ProductSelectSwagger,
  ProductUpdateSwagger,
} from './product.swagger';

@Controller('product')
@ApiBearerAuth('authorization')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //   @UseGuards(AuthGuard)
  @ApiQuery({ type: ProductSelectSwagger })
  @Get('/list')
  async getProduct(@Query() data: any) {
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

  @UseGuards(AuthGuard)
  @Get('/detail/:id')
  @ApiOkResponse({
    description: '상품 상세 조회',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: '상품 상세 조회 성공',
        },
        data: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: {
                product_id: { type: 'number' },
                product_title: { type: 'string' },
                product_img_key: { type: 'string' },
                product_memo: { type: 'string' },
                product_price: { type: 'number' },
                islike: { type: 'boolean' },
                image_urls: { type: 'array', example: [] },
              },
            },
            user: {
              type: 'object',
              properties: {
                user_name: { type: 'string' },
                user_email: { type: 'string' },
                profile_image: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async getProductDetail(@Param('id') id: string, @Request() req) {
    try {
      if (req.user === undefined) {
        return { success: false, message: '회원정보를 확인할수 없습니다' };
      }
      return this.productService.getProductDetail(id, req.user.id);
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
  @ApiOkResponse({
    description: '상품정보 수정 성공',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: '상품정보 수정 성공',
        },
      },
    },
  })
  @ApiBody({ type: ProductUpdateSwagger })
  async updateProduct(@Body() data: productUpdate) {
    try {
      return this.productService.updateProduct(data);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Post('/delete')
  @ApiBody({ type: ProductDeleteSwagger })
  async deleteProduct(@Body() data: productDelete) {
    try {
      return this.productService.deleteProduct(data);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

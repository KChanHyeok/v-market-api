import { Injectable } from '@nestjs/common';
import { ProductInsert } from './product.interface';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@src/entity/product.entity';
import { multipleImageUpload } from '@src/utils/imageupload';

@Injectable()
export class ProductService {
  constructor(
    @InjectDataSource() private readonly reponsitory: Repository<any>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async insertProduct(files: File[], data: ProductInsert) {
    try {
      if (files.length < 1) {
        throw new Error('파일을 기제하지 않았습니다.');
      }
      const { success, images_url } = await multipleImageUpload(files);
      if (success) {
        //   data.product_img = profile_image;

        //   DB insert code here...
        // await this.productRepository.save(data);
        return { success: true, message: '상품 등록 성공' };
      }
    } catch (error) {
      throw error;
    }
  }
}

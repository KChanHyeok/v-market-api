import { Injectable } from '@nestjs/common';
import { ProductInsert } from './product.interface';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@src/entity/product.entity';
import { multipleImageUpload } from '@src/utils/imageupload';
import { v1 as uuid } from 'uuid';
import { Images } from '@src/entity/images.entity';

@Injectable()
export class ProductService {
  constructor(
    // @InjectModel(Images.name) private readonly productService: Model<Images>,
    @InjectDataSource() private readonly reponsitory: Repository<any>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}

  async getListProduct(search: string, pages: number, page_count: number) {
    try {
      let sql = `SELECT 
  p.product_id, u.user_name, u.profile_image, u.email AS user_email,
  p.product_title, p.product_memo, p.product_price, p.product_view_count,
  img.image_url
  FROM product AS p
  INNER JOIN user AS u
  ON p.user_id = u.id
  INNER JOIN images AS img
  ON p.product_img_key = img.image_key
  WHERE img.image_sort_num = 0
  GROUP BY p.product_id
  ORDER BY p.product_id ASC
`;
      sql += ` LIMIT ${page_count} OFFSET ${page_count * (pages - 1)}`;
      let list = await this.reponsitory.query(sql);

      list = list.map((item) => ({
        user: {
          user_name: item.user_name,
          profile_image: item.profile_image,
          user_email: item.user_email,
        },
        product: {
          product_id: item.product_id,
          product_title: item.product_title,
          product_memo: item.product_memo,
          product_price: item.product_price,
          product_view_count: item.product_view_count,
          image_url: item.image_url,
        },
      }));
      return { success: true, message: '상품 목록', data: list };
    } catch (error) {
      return error;
    }
  }

  async insertProduct(files: File[], data: ProductInsert) {
    try {
      if (files.length < 1) {
        throw new Error('파일을 기제하지 않았습니다.');
      }
      const { success, images_url } = await multipleImageUpload(files);
      if (success) {
        const image_key = uuid();
        await Promise.all(
          images_url.map(async (url, index) => {
            try {
              return await this.imagesRepository.save({
                image_sort_num: Number(index),
                image_key,
                image_url: url,
              });
            } catch (error) {
              throw new Error('이미지 저장 실패');
            }
          }),
        );
        data.product_img_key = image_key;

        //   DB insert code here...
        await this.productRepository.save(data);
        return { success: true, message: '상품 등록 성공' };
      }
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import {
  productDelete,
  ProductInsert,
  productUpdate,
} from './product.interface';
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

  async getProductDetail(id: string, user_id: string) {
    try {
      const sql = `SELECT p.product_id, p.product_title, p.product_memo, p.product_price, 
      p.reg_date,
      u.email AS user_email, u.user_name, u.profile_image,
      IF(li.like_id , 'TRUE', 'FALSE') as islike,
      GROUP_CONCAT( img.image_url ORDER BY img.image_url SEPARATOR ',' ) AS iamge_urls
      FROM product AS p
      INNER JOIN user u
      ON p.user_id = u.id
      INNER JOIN images AS img
      ON p.product_img_key = img.image_key
      LEFT JOIN \`like\` AS li
      ON p.product_id = li.product_id AND u.id = '${user_id}'
      WHERE p.product_id = '${id}'
      GROUP BY p.product_id`;
      const [product] = await this.reponsitory.query(sql);
      if (!product) {
        return { success: false, message: '존재하지 않는 상품입니다.' };
      }
      const data = {
        product: {
          product_id: product.product_id,
          product_title: product.product_title,
          product_memo: product.product_memo,
          product_price: product.product_price,
          reg_date: product.reg_date,
          islike: product.islike === 'TRUE' ? true : false, // Boolean value
          image_urls: product.iamge_urls.split(','),
        },
        user: {
          user_name: product.user_name,
          user_email: product.user_email,
          profile_image: product.profile_image,
        },
      };
      return { success: true, message: '상품 상세정보', data };
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
              throw new Error(`이미지 저장 실패 Error: ${error}`);
            }
          }),
        );
        data.product_img_key = image_key;

        //   DB insert code here...
        await this.productRepository.save(data);
        return { success: true, message: '상품 등록 성공' };
      }
    } catch (error) {
      return error;
    }
  }

  async updateProduct(data: productUpdate) {
    try {
      const newdata: Partial<productUpdate> = {};
      if (data.product_title) newdata.product_title = data.product_title.trim();
      if (data.product_memo) newdata.product_memo = data.product_memo.trim();
      if (data.product_price !== undefined)
        newdata.product_price = data.product_price;

      await this.productRepository.update(
        { product_id: data.product_id, user_id: data.user_id },
        newdata,
      );
      return { success: true, message: '상품 수정 성공' };
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(data: productDelete) {
    try {
      const result = await this.productRepository.delete({
        product_id: data.product_id,
        user_id: data.user_id,
      });
      if (result.affected === 0) {
        return { success: false, message: '삭제할 상품이 없습니다.' };
      }
      return { success: true, message: '상품삭제 성공' };
    } catch (error) {
      return error;
    }
  }
}

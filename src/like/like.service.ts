import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Like } from '@src/entity/like.entity';
import { Product } from '@src/entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectDataSource() private readonly reponsitory: Repository<any>,
  ) {}

  async getLikeList(
    search: string,
    pages: number,
    page_count: number,
    user_id: string,
  ) {
    try {
      let sql = `SELECT 
      p.product_id, p.product_title, p.product_price,
      img.image_url,
      u.user_name, u.profile_image
      FROM \`like\` AS li
      INNER JOIN product p
      ON p.product_id = li.product_id
      INNER JOIN images AS img
      ON p.product_img_key = img.image_key
      INNER JOIN user AS u
      ON li.user_id = u.id
      WHERE img.image_sort_num = 0 AND u.id = '${user_id}'
      ORDER BY p.product_id ASC`;

      sql += ` LIMIT ${page_count} OFFSET ${page_count * (pages - 1)}`;
      let list = await this.reponsitory.query(sql);

      return { success: true, message: '찜목록', data: list };
    } catch (error) {
      return error;
    }
  }

  async addLike(data: any) {
    try {
      if (!data.product_id || !data.user_id) {
        return {
          success: false,
          message: '제품 ID 또는 회원ID가 존재 하지 않습니다.',
        };
      }
      const ok = this.productRepository.findOne({
        where: { product_id: data.product_id },
      });
      if (ok) {
        const like = {
          like_id: `${data.product_id}_${new Date().getTime()}`,
          product_id: data.product_id,
          user_id: data.user_id,
        };
        await this.likeRepository.save(like);
        return {
          success: true,
          message: '좋아요 성공',
        };
      } else {
        return { success: false, message: '존재하지 않는 제품 ID입니다.' };
      }
    } catch (error) {
      if (error.errno) {
        return { success: false, message: '이미 좋아요를 입력했습니다.' };
      }
      return error;
    }
  }

  async removeLike(data: any) {
    try {
      if (!data.product_id || !data.user_id) {
        return {
          success: false,
          message: '제품 ID 또는 회원ID가 존재 하지 않습니다.',
        };
      }
      const result = await this.likeRepository.delete({
        product_id: data.product_id,
        user_id: data.user_id,
      });
      if (result.affected === 0) {
        return { success: false, message: '좋아요 취소 실패' };
      }
      return { success: true, message: '좋아요 취소 성공' };
    } catch (error) {
      return error;
    }
  }
}

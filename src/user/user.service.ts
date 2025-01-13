import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userUpdate } from './user.interface';
import { imageUpload } from '@src/utils/imageupload';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource() private readonly repository: Repository<any>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUser(id: string) {
    const sql = `select id, email, profile_image, user_name, phone, reg_date from user where id = '${id}'`;
    try {
      const [user] = await this.repository.query(sql);

      if (!user) {
        return { success: false, message: '존재하지 않는 회원입니다.' };
      }
      return {
        success: true,
        message: '회원 정보',
        data: user,
      };
    } catch (error) {
      return { success: false, message: '존재하지 않는 회원입니다.' };
    }
  }

  async updateUser(body: userUpdate, file: File) {
    try {
      // const user = await this.userverify(body.id);
      // if (!user) {
      //   return { success: false, message: '존재하지 않는 회원입니다.' };
      // }
      if (file) {
        const { success, profile_image } = await imageUpload(file);
        if (success) {
          body.profile_image = profile_image;
        }
      }
      await this.userRepository.update({ id: body.id }, body);
      return {
        success: true,
        message: '회원정보 수정완료',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.userRepository.delete({ id });
      return {
        success: true,
        message: '회원 탈퇴 성공',
      };
    } catch (error) {
      throw error;
    }
  }
}

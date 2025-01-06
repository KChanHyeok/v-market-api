import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@src/models/user.models';
import { Model } from 'mongoose';
import { userUpdate } from './user.interface';
import { imageUpload } from '@src/utils/imageupload';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async userverify(id: string) {
    try {
      const user = await this.userModel.findOne(
        { _id: id },
        {
          user_name: 1,
          email: 1,
        },
      );
      return Boolean(user);
    } catch (error) {
      return false;
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userModel.findOne(
        { _id: id },
        {
          _id: 1,
          profile_image: 1,
          user_name: 1,
          phone: 1,
          email: 1,
          reg_date: 1,
        },
      );
      return {
        success: true,
        message: '회원 정보',
        data: {
          id: user._id,
          profile_image: user.profile_image,
          user_name: user.user_name,
          phone: user.phone,
          email: user.email,
          reg_date: user.reg_date,
        },
      };
    } catch (error) {
      return { success: false, message: '존재하지 않는 회원입니다.' };
    }
  }

  async updateUser(body: userUpdate, file: File) {
    try {
      let data: userUpdate = {
        change_date: new Date(),
      };
      if (body.user_name) data = { ...data, user_name: body.user_name };
      if (body.phone) data = { ...data, phone: body.phone };
      if (body.account_number) {
        data = { ...data, account_number: body.account_number };
      }
      const user = await this.userverify(body.id);
      if (!user) {
        return { success: false, message: '존재하지 않는 회원입니다.' };
      }
      if (file) {
        const { success, profile_image } = await imageUpload(file);
        if (success) {
          data = { ...data, profile_image };
        }
      }
      await this.userModel.updateOne(
        {
          _id: body.id,
        },
        {
          $set: data,
        },
      );
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
      const user = await this.userverify(id);
      if (!user) {
        return { success: false, message: '존재하지 않는 회원입니다.' };
      }
      await this.userModel.deleteOne({ _id: id });
      return {
        success: true,
        message: '회원 탈퇴 성공',
      };
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@src/models/user.models';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(id: string) {
    try {
      console.log(id);
      const user = await this.userModel.findOne(
        { _id: id },
        {
          user_name: 1,
          email: 1,
        },
      );
      if (!user) {
        return { success: false, message: '존재하지 않는 회원입니다.' };
      }
      return {
        success: true,
        message: '회원 정보',
        data: user,
      };
    } catch (err) {
      throw err;
    }
  }
}

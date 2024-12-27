import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@src/models/user.models';
import * as bcrypt from 'bcrypt';
import { CreateUser, Login } from './auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getUser(id: string) {
    try {
      const user = await this.userModel.findOne({ email: id });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async login(user: Login) {
    try {
      const result = await this.userModel.findOne({
        email: user.email,
      });
      const ok = await bcrypt.compare(user.user_pwd, result.user_pwd);
      if (!ok) {
        throw new HttpException(
          { message: { password: ['비밀번호가 틀렸습니다'] } },
          403,
        );
      }
      const payload = {
        id: result.email,
      };
      const access_token = this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      });
      return {
        success: true,
        message: '로그인 성공',
        data: {
          id: result.id,
          access_token,
          refresh_token: result.refresh_token,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async createUser(body: CreateUser) {
    try {
      const result = await this.getUser(body.email);
      if (result) throw new HttpException('이미 계정이 존재합니다', 404);
      const hashedPassword = await bcrypt.hash(body.user_pwd, 12);
      const refresh_token = this.jwtService.sign(
        { id: body.email },
        { expiresIn: process.env.JWT_REFRESH_TOKEN_SECRET_EXPIRATION_TIME },
      );
      const data = {
        email: body.email,
        user_name: body.user_name,
        user_pwd: hashedPassword,
        refresh_token,
        phone: body.phone,
        goo_token: body.goo_token,
        kakao_token: body.kakao_token,
        account_number: body.account_number,
      };
      const user = await new this.userModel(data, {
        _id: 1,
      }).save();
      return {
        success: true,
        message: '회원가입 성공',
        id: user._id,
      };
    } catch (err) {
      throw err;
    }
  }
}

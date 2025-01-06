import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@src/models/user.models';
import * as bcrypt from 'bcrypt';
import { CreateUser, Login } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { getUploadUrl } from '@src/utils/imageupload';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // async getUploadUrl() {
  //   const response = await fetch(
  //     `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
  //       },
  //     },
  //   );
  //   const data = await response.json();
  //   return data;
  // }

  async compareTokenExpiration(exp: number) {
    const time = new Date().getTime() / 1000;
    const isExpired = exp < time ? true : false;
    return isExpired;
  }

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
        id: result._id,
      };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
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

  async createUser(body: CreateUser, file: any) {
    try {
      const ok = await this.getUser(body.email);
      if (ok) throw new HttpException('이미 계정이 존재합니다', 404);
      const { success, result } = await getUploadUrl();

      if (success) {
        const { id, uploadURL } = result;

        if (file) {
          let cloudflareForm = new FormData();
          const blob = new Blob([file.buffer], { type: file.mimetype });

          // FormData에 파일 추가
          cloudflareForm.append('file', blob, file.originalname);
          const response = await fetch(uploadURL, {
            method: 'POST',
            body: cloudflareForm,
          });
          if (response.status !== 200) {
            throw new HttpException('업로드 실패', response.status);
          }
        } else {
          throw new HttpException('프로필 이미지가 없습니다', 404);
        }

        const hashedPassword = await bcrypt.hash(body.user_pwd, 12);
        const refresh_token = this.jwtService.sign(
          { email: body.email },
          {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_SECRET_EXPIRATION_TIME,
          },
        );
        const data = {
          email: body.email,
          user_name: body.user_name,
          user_pwd: hashedPassword,
          profile_image: `https://imagedelivery.net/afl0oSwYy5bcInHa7uXGQg/${id}/public`,
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
      } else {
        throw new HttpException('Cloudflare API Error', 500);
      }
    } catch (err) {
      throw err;
    }
  }

  async getAccessToken(req: Request) {
    try {
      if (req.headers['authorization']) {
        const [type, token] = req.headers['authorization'].split(' ') ?? [];
        if (type !== 'Bearer') {
          throw new HttpException('올바르지 못한 전송방식입니다.', 401);
        }
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        });
        const user = await this.userModel.findOne(
          { email: payload.email },
          {
            id: 1,
          },
        );
        if (!user) {
          throw new HttpException('유효하지 않은 토큰입니다.', 401);
        }

        const newPayload = {
          id: user._id,
        };

        const access_token = this.jwtService.sign(newPayload, {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        });

        return {
          success: true,
          message: '토큰 재발행',
          access_token,
        };
      } else {
        throw new HttpException('토큰이 존재 하지 않습니다', 401);
      }
    } catch (error) {
      return error;
    }
  }
}

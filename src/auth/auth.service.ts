import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUser, Login } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { getUploadUrl } from '@src/utils/imageupload';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly repository: Repository<any>,
    // 기본 쿼리문을 작성용
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // typeorm 방식의 적용된 Entity의 사용
    private jwtService: JwtService,
  ) {}

  async compareTokenExpiration(exp: number) {
    const time = new Date().getTime() / 1000;
    const isExpired = exp < time ? true : false;
    return isExpired;
  }

  async getUser(email: string) {
    try {
      const user = await this.repository.query(
        `SELECT id, email, user_pwd, refresh_token FROM user WHERE email='${email}';`,
      );
      return user[0] ? user[0] : false;
    } catch (err) {
      throw err;
    }
  }

  async login(user: Login) {
    try {
      const result = await this.getUser(user.email);
      const ok = await bcrypt.compare(user.user_pwd, result.user_pwd);
      if (!ok) {
        throw new HttpException(
          { message: { password: ['비밀번호가 틀렸습니다'] } },
          403,
        );
      }
      const payload = {
        id: result.id,
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
        await this.userRepository.save(data);

        return {
          success: true,
          message: '회원가입 성공',
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
        const sql = `SELECT id, email FROM user WHERE email ='${payload.email}'`;
        const user = await this.repository.query(sql);
        if (!user) {
          throw new HttpException('유효하지 않은 토큰입니다.', 401);
        }

        const newPayload = {
          id: user[0].id,
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

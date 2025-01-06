import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });

      this.expCheckToken(payload);
      return true;
    } catch (error) {
      throw new HttpException('이미 만료된 토큰입니다.', 403);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (request.headers['authorization']) {
      const [type, token] = request.headers['authorization'].split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    } else {
      return undefined;
    }
  }

  private expCheckToken(payload: any) {
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (exp - now < 300) {
      throw new HttpException('토큰 만료3분전입니다.', 403);
    }
    return true;
  }
}

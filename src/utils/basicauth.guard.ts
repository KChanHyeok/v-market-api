import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new HttpException('토큰이 존재 하지 않습니다.', 500);
    }
    const [schema, token] = authorization.split(' ');
    if (schema.toLowerCase() !== 'basic') {
      throw new HttpException('형식에 맞지 않습니다', 403);
    }

    const [id, pwd] = Buffer.from(token, 'base64').toString('utf8').split(':');
    const user = await this.authService.getUser(id);
    if (!user) {
      throw new HttpException(
        { message: { email: ['존재하지 않는 아이디입니다.'] } },
        403,
      );
    }
    request.user = {
      email: id,
      user_pwd: pwd,
    };

    return true;
  }
}

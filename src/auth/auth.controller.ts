import {
  Body,
  Controller,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicAuthGuard } from '@utils/basicauth.guard';
import { CreateUser } from './auth.interface';
import { ApiBasicAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthSwagger } from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiBasicAuth('basicauth')
  @ApiOkResponse({
    description: '로그인 성공',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: '로그인 성공',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            access_token: { type: 'string' },
            refresh_token: { type: 'string' },
          },
          required: ['access_token', 'refresh_token'],
        },
      },
      required: ['success', 'message', 'data'],
    },
  })
  @UseGuards(BasicAuthGuard)
  login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Post('/create')
  @ApiOkResponse({
    description: '회원가입 성공',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: '회원가입 성공',
        },
        id: { type: 'string', example: 'qwohyawjriopqwt123asd124' },
      },
      required: ['success', 'message', 'data'],
    },
  })
  @ApiBody({ type: AuthSwagger })
  createUser(@Body() body: CreateUser) {
    try {
      return this.authService.createUser(body);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

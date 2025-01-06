import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicAuthGuard } from '@utils/basicauth.guard';
import { CreateUser } from './auth.interface';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthSwagger } from './auth.swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AuthSwagger })
  createUser(@UploadedFile() file: File, @Body() body: CreateUser) {
    try {
      return this.authService.createUser(body, file);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @Post('/refresh')
  @ApiBearerAuth('authorization')
  restoreAccessToken(@Req() req: Request) {
    try {
      return this.authService.getAccessToken(req);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJpZCI6Imthbmc5a2FuZzlAZ21haWwuY29tIiwiaWF0IjoxNzM1ODg5MzY5LCJleHAiOjE3Njc0MjUzNjl9
//   .C5JfhFMxna -
//   QVCztFgZC3QmZ -
//   L8SkJAz9cE5RJXxz -
//   4;

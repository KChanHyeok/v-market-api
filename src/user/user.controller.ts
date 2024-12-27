import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { UserSwagger } from './user.swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // guard 적용 예정
  @Get('/info')
  @ApiOkResponse({
    description: '회원정보',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: '상태 구분 메세지 설명',
        },
        data: {
          type: 'object',
          example: {
            _id: { type: 'string', example: '1234567890' },
            user_name: { type: 'string', example: 'testUser' },
            email: { type: 'string', example: 'test@example.com' },
          },
        },
      },
      required: ['id', 'user_name', 'email'],
    },
  })
  @ApiNotFoundResponse({
    description: '회원정보',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'false',
        },
        message: {
          type: 'string',
          example: '실패 구분 메세지 설명',
        },
      },
      required: ['id', 'user_name', 'email'],
    },
  })
  @ApiQuery({ type: UserSwagger })
  getUserInfo(@Query() data: any) {
    try {
      return this.userService.getUser(data?.id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

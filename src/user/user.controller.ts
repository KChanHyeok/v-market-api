import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UserSwagger, UserUpdateSwagger } from './user.swagger';
import { userDelete, userUpdate } from './user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@src/utils/authguard.guard';

@Controller('user')
@ApiBearerAuth('authorization')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // guard 적용 예정
  @UseGuards(AuthGuard)
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
            id: { type: 'string', example: '1234567890' },
            profile_image: { type: 'string', example: 'http://image.com' },
            user_name: { type: 'string', example: 'testUser' },
            phone: { type: 'string', example: '01000000000' },
            email: { type: 'string', example: 'test@example.com' },
            reg_date: { type: 'date', expected: new Date() },
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

  @Post('update')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: '회원정보 수정 완료',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: '회원정보 수정 성공',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '없는 회원일 경우',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'false',
        },
        message: {
          type: 'string',
          example: '존재하지 않는 회원입니다.',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profile_image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UserUpdateSwagger })
  updateUserInfo(@UploadedFile() file: File, @Body() body: userUpdate) {
    try {
      return this.userService.updateUser(body, file);
    } catch (error) {
      throw error;
    }
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: '회원 탈퇴 성공',
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: '회원 탈퇴 성공',
        },
      },
    },
  })
  @ApiBody({ type: UserSwagger })
  deleteUserInfo(@Body() body: userDelete) {
    try {
      return this.userService.deleteUser(body.id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

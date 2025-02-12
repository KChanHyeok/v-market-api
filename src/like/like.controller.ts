import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { LikeSelectSwagger, LikeSwagger } from './like.swgger';
import { AuthGuard } from '@src/utils/authguard.guard';

@Controller('like')
@ApiBearerAuth('authorization')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  @UseGuards(AuthGuard)
  @ApiQuery({ type: LikeSelectSwagger })
  @Get('/list')
  async getLikeList(@Query() data: any, @Request() req) {
    try {
      if (req.user === undefined) {
        return { success: false, message: '회원정보를 확인할수 없습니다' };
      }

      return this.likeService.getLikeList(
        data.search,
        data.pages,
        data.page_count,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiBody({ type: LikeSwagger })
  @Post('/add')
  async addLike(@Body() data: any) {
    try {
      return this.likeService.addLike(data);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiBody({ type: LikeSwagger })
  @Post('/remove')
  async removeLike(@Body() data: any) {
    try {
      return this.likeService.removeLike(data);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

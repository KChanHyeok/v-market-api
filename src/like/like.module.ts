import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '@src/entity/like.entity';
import { Product } from '@src/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Product])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}

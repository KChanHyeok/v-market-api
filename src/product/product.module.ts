import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@src/entity/product.entity';
import { Images } from '@src/entity/images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Images]),
    // MongooseModule.forFeature([{ name: Images.name, schema: ImagesSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

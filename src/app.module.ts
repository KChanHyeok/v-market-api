import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { User } from './entity/user.entity';
import { Product } from './entity/product.entity';
import { ProductModule } from './product/product.module';
import { Images } from './entity/images.entity';
import { Like } from './entity/like.entity';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    LikeModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, { dbName: 'v-market' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'vmarket',
      entities: [User, Product, Images, Like],
      logging: true,
      synchronize: false,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_CONSTANTS,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

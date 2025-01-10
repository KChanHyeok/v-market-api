import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Product } from './entity/product.entity';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'vmarket',
      entities: [User, Product],
      logging: true,
      synchronize: false,
    }),
    // MongooseModule.forRoot(process.env.DB_URI, { dbName: 'v-market' }),
    // 채팅방 연결 필요시 사용

    JwtModule.register({
      global: true,
      secret: process.env.JWT_CONSTANTS,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

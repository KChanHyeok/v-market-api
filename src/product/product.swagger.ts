import { ApiProperty } from '@nestjs/swagger';

export class ProductInserSwagger {
  @ApiProperty({ required: true, description: '유저 ID' })
  user_id: string;

  @ApiProperty({ required: true, description: '' })
  product_title: string;

  @ApiProperty({
    isArray: true,
    required: true,
    format: 'binary',
  })
  product_img: string;

  @ApiProperty()
  product_memo: string;

  @ApiProperty()
  product_price: number;
}

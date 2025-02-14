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
  product_img_key: string;

  @ApiProperty()
  product_memo: string;

  @ApiProperty()
  product_price: number;
}

export class ProductUpdateSwagger {
  @ApiProperty({ required: true, description: '상품 ID' })
  product_id: string;

  @ApiProperty({ required: true, description: '유저 ID' })
  user_id: string;

  @ApiProperty({ required: false, description: '상품명' })
  product_title: string;

  @ApiProperty({ required: false, description: '상품설명' })
  product_memo: string;

  @ApiProperty({ required: false, description: '상품가격' })
  product_price: string;
}

export class ProductSelectSwagger {
  @ApiProperty({ required: true, description: '페이지당 보여질 갯수' })
  page_count: number;

  @ApiProperty({ required: true, description: '현재 페이지' })
  pages: number;

  @ApiProperty({ required: false, description: '검색' })
  search: string;
}

export class ProductDeleteSwagger {
  @ApiProperty({ required: true, description: '상품 ID' })
  product_id: string;

  @ApiProperty({ required: true, description: '유저 ID' })
  user_id: string;
}

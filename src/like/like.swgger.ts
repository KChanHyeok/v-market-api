import { ApiProperty } from '@nestjs/swagger';

export class LikeSwagger {
  @ApiProperty({ required: true, description: '상품 ID' })
  product_id: string;

  @ApiProperty({ required: true, description: '유저 ID' })
  user_id: string;
}

export class LikeSelectSwagger {
  @ApiProperty({ required: true, description: '페이지당 보여질 갯수' })
  page_count: number;

  @ApiProperty({ required: true, description: '현재 페이지' })
  pages: number;

  @ApiProperty({ required: false, description: '검색' })
  search: string;
}

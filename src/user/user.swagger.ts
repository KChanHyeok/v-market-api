import { ApiProperty } from '@nestjs/swagger';

export class UserSwagger {
  @ApiProperty({ required: true, description: 'User id' })
  id: string;
}

export class UserUpdateSwagger {
  @ApiProperty({ required: true, description: 'userId' })
  id: string;

  @ApiProperty({ required: false, description: '회원명 변경' })
  user_name: string;

  @ApiProperty({ required: false, description: '전화번호변경' })
  phone: string;

  @ApiProperty({
    required: false,
    format: 'binary',
    description: '프로필 이미지',
  })
  profile_image: string;

  @ApiProperty({ required: false, description: '계좌번호' })
  account_number: string;
}

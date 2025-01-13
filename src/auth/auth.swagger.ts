import { ApiProperty } from '@nestjs/swagger';

export class AuthSwagger {
  @ApiProperty({ required: true, description: 'Email' })
  email: string;

  @ApiProperty({ required: true, description: 'Password' })
  user_pwd: string;

  @ApiProperty({ required: true, description: 'UserName' })
  user_name: string;

  @ApiProperty({ required: true, description: 'Phone' })
  phone: string;

  @ApiProperty({ required: false, description: 'Google OAuth Token' })
  goo_token?: string;

  @ApiProperty({ required: false, description: 'Kakao OAuth Token' })
  kakao_token?: string;

  @ApiProperty({ required: false, description: 'account OAuth Token' })
  account_number?: string;

  @ApiProperty({
    required: true,
  })
  profile_image: string[];
}

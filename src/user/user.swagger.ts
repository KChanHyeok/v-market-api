import { ApiProperty } from '@nestjs/swagger';

export class UserSwagger {
  @ApiProperty({ required: true, description: 'User id' })
  id: string;
}

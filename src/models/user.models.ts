import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ require: true, unique: true })
  email: string;

  @Prop({ required: true })
  user_pwd: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  refresh_token: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  goo_token: string;

  @Prop({ required: false })
  kakao_token: string;

  @Prop({ required: false })
  account_number: string;

  @Prop({ required: false })
  profile_image: string;

  @Prop({ required: true, type: Date, default: new Date() })
  reg_date: Date;

  @Prop({ required: false, type: Date, default: new Date() })
  change_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

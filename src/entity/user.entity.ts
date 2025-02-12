import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn('varchar', { length: 30 })
  email: string;

  @Column('varchar', { length: 40 })
  user_name: string;

  @Column('text')
  user_pwd: string;

  @Column('text')
  refresh_token: string;

  @Column('varchar', { length: 13 })
  phone: string;

  @Column({ nullable: true, type: 'text' })
  goo_token: string;

  @Column({ nullable: true, type: 'text' })
  kakao_token: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  account_number: string;

  @Column('text')
  profile_image: string;

  @CreateDateColumn()
  reg_date: Date;

  @UpdateDateColumn()
  change_date: Date;
}

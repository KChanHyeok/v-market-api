import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column('varchar', { length: 36 })
  user_id: string;

  @Column('varchar', { length: 25 })
  product_title: string;

  @Column({ type: 'text' })
  product_img_key: string;

  @Column({ type: 'text' })
  product_memo: string;

  @Column({ default: 0, type: 'integer' })
  product_price: number;

  @Column({ default: 0, type: 'integer' })
  product_view_count: number;

  @CreateDateColumn()
  reg_date: Date;

  @UpdateDateColumn()
  change_date: Date;
}

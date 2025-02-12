import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Unique(['product_id', 'user_id']) // user_id와 product_id가 유니크한 조합이 되도록 설정
export class Like {
  @PrimaryColumn() // UUID를 사용하여 고유한 식별자를 자동으로 생성
  like_id: string;

  @Column({ type: 'integer' })
  product_id: number;

  @Column({ type: 'varchar', length: 255 })
  user_id: string;

  @CreateDateColumn()
  reg_date: Date;

  @UpdateDateColumn()
  change_date: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  image_id: number;

  @PrimaryColumn()
  image_key: string;

  @Column()
  image_sort_num: number;

  @Column()
  image_url: string;

  @CreateDateColumn()
  reg_date: Date;

  @UpdateDateColumn()
  change_date: Date;
}

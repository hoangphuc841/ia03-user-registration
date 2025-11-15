import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  hash_password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  hashedRefreshToken: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

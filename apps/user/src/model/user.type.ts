import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


@Entity()
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  
  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}

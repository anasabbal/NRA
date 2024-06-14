import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'integer' })
  eta: number; 
}
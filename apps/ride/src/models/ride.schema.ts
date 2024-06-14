import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "./status";




@Entity()
export class Ride {

    @PrimaryGeneratedColumn('uuid')
    ride_id: string;

    @Column({ type: 'varchar' })
    driver_id: string;

    @ManyToOne(() => Location, { eager: true, cascade: true })
    location_pickup: Location;

    @ManyToOne(() => Location, { eager: true, cascade: true })
    location_destination: Location;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PROCESSING,
    })
    status: Status;
}
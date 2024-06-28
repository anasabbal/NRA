import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DriverStatus } from '../enums/driver.status';

@Entity()
export class Driver {

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'integer' })
    user_id: string;

    @Column({ type: 'varchar', length: 50 })
    license_number: string;

    @Column({ type: 'integer', nullable: true })
    vehicle_id: number;

    @Column({ type: 'float', nullable: true })
    rating: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({
        type: 'enum',
        enum: DriverStatus,
        default: DriverStatus.EMPTY
    })
    driverStatus: DriverStatus;
}

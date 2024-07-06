import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { UserType } from './user.type';
import { v4 as uuidv4 } from 'uuid';



@Entity()
export class User {

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    firstName: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    lastName: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @ManyToOne(() => UserType, { eager: true, nullable: true })
    @JoinColumn({ name: 'userTypeId' })
    userType: UserType;

    @Column({ type: 'boolean', default: false })
    verified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

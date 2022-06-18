import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('point')
export class Point extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userUUID: string;
    
    @Column()
    reviewId: number;

    @Column()
    addPoint: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @DeleteDateColumn()
    deletedDate: Date;
    
}
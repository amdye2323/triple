import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('review')
export class Review extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    reviewUUID: string;

    @Column()
    userUUID: string;

    @Column()
    placeUUID: string;

    @Column()
    content: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @DeleteDateColumn()
    deletedDate: Date;

}

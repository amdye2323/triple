import { Point } from "src/point/entities/point.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Photo } from "./photo.entity";

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
    updatedDate: Date;

    @DeleteDateColumn()
    deletedDate: Date;

    @OneToMany((type) => Point, (item) => item.review )
    pointList: Point[];

    @OneToMany((type) => Photo, (item) => item.review )
    photos:Photo[];

    static of(params: Partial<Review>): Review {
        const review = new Review();

        Object.assign(review, params);

        return review;
    }
}

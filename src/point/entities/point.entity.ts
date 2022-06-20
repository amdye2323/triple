import { Review } from "src/review/entities/review.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { pointType } from "../point.enum";

@Entity('point')
export class Point extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userUUID: string;
    
    @Column()
    reviewId: number;

    @Column({default: 1})
    pointType: pointType;

    @Column()
    point: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    @DeleteDateColumn()
    deletedDate: Date;

    @ManyToOne((type) => Review, review => review.pointList, { nullable: false })
    review: Review
    
    static of(params: Partial<Point>): Point{
        const point = new Point();

        Object.assign(point, params);

        return point;
    }
}
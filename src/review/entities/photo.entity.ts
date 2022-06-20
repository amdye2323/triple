import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Review } from "./review.entity";
@Entity('photo')
export class Photo extends BaseEntity{

    @PrimaryColumn()
    id: number;

    @Column()
    reviewId: number;

    @Column()
    photoUUID: string;
    
    @ManyToOne((type) => Review, review => review.photos, {nullable:false})
    review: Review;
    
}
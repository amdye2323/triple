import { Column, PrimaryColumn } from "typeorm";

export class Photo{

    @PrimaryColumn()
    id: number;

    @Column()
    reviewId: number;

    @Column()
    photoUUID: string;
    
}
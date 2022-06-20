import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner } from "typeorm";
import { CreateReviewDto } from "../dto/create-review.dto";
import { Photo } from "../entities/photo.entity";
import { Review } from "../entities/review.entity";
import { PhotoRepository } from "../repository/photo.repository";

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(PhotoRepository) private readonly photoRepo:PhotoRepository
    ){}

    async addPhotos(createReviewDto: CreateReviewDto, reviewId:number, queryRunner:QueryRunner):Promise<Photo[]>{
        try {

            let photos:Photo[] = [];

            for await(const photo of createReviewDto.attachedPhotoIds){
                let photoInfo:Photo = new Photo();
        
                photoInfo.photoUUID = photo;
                photoInfo.reviewId = reviewId;
        
                const result = await queryRunner.manager.save(Photo,photoInfo);
                photos.push(result);
            }

            return photos;
        } catch(e){
            throw e;
        }
    }

    async resetPhotos(createReviewDto: CreateReviewDto, reviewId:number, queryRunner:QueryRunner):Promise<Photo[]>{
        try {
            await queryRunner.manager.delete(Photo,{
                reviewId
            });

            let photos:Photo[] = [];

            for await(const photo of createReviewDto.attachedPhotoIds){
                let photoInfo:Photo = new Photo();
        
                photoInfo.photoUUID = photo;
                photoInfo.reviewId = reviewId;
        
                const result = await queryRunner.manager.save(Photo,photoInfo);
                photos.push(result);
            }

            return photos;
        } catch(e){
            throw e;
        }
    }

    async removePhotos(reviewId:number, queryRunner:QueryRunner):Promise<number>{
        try {
            await queryRunner.manager.delete(Photo,{
                reviewId
            });
            
            return 1;
        } catch(e){
            throw e;
        }
    }
}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReviewDto } from "src/review/dto/create-review.dto";
import { Review } from "src/review/entities/review.entity";
import { ReviewRepository } from "src/review/repository/review.repository";
import { QueryRunner } from "typeorm";
import { Point } from "../entities/point.entity";
import { pointType } from "../point.enum";
import { PointRepository } from "../point.repository";

@Injectable()
export class PointService{
    constructor(
        @InjectRepository(PointRepository) private readonly pointRepo:PointRepository,
        @InjectRepository(ReviewRepository) private readonly reviewRepo:ReviewRepository
    ){}

    async addPoint(createReviewDto: CreateReviewDto, reviewId:number, queryRunner:QueryRunner):Promise<number>{
        try {
            let pointList:Point[] = [];
            const exsistPlaceInfo:Review = await this.reviewRepo.findOne({where:{
                placeUUID:createReviewDto.placeId
            }});

            // 포인트 계산
            if(createReviewDto.content.length>=1){ // 리뷰가 1글자 이상
                let point:Point = new Point();
                point.pointType = pointType.TEXT_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            } 
            if(createReviewDto.attachedPhotoIds.length >= 1){ // 사진이 재재
                let point:Point = new Point();
                point.pointType = pointType.TEXT_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            }
            if(!exsistPlaceInfo){ // 장소가 처음인 경우
                let point:Point = new Point();
                point.pointType = pointType.TEXT_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            }

            return 1;

        } catch(e){
            throw e;
        }
    }
    
    async updatePoint(createReviewDto: CreateReviewDto,  reviewId:number, queryRunner:QueryRunner):Promise<number>{
        try {
            

            return;
        } catch(e){
            throw e;
        }
    }

    async deletePoint(createReviewDto: CreateReviewDto,  reviewId:number, queryRunner:QueryRunner):Promise<number>{
        try {
            // 기존 리뷰 포인트 초기화
            const pointList:Point[] = await this.pointRepo.find({where:{reviewId}});

            for await(const pointInfo of pointList){
                await queryRunner.manager.delete(Point, pointInfo);
            }

            return 1;
        } catch(e){
            throw e; 
        }
    }
}
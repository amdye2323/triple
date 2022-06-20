import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReviewDto } from "src/review/dto/create-review.dto";
import { Review } from "src/review/entities/review.entity";
import { QueryRunner } from "typeorm";
import { Point } from "../entities/point.entity";
import { pointType } from "../point.enum";
import { PointRepository } from "../point.repository";

@Injectable()
export class PointService{
    constructor(
        @InjectRepository(PointRepository) private readonly pointRepo:PointRepository,
    ){}

    async addPoint(createReviewDto: CreateReviewDto, reviewId:number, queryRunner:QueryRunner):Promise<number>{
        try {
            let pointList:Point[] = [];

            const exsistPlaceInfo:Review = await Review.findOne({where: {
                placeUUID:createReviewDto.placeId
            }});

            // 포인트 계산
            if(createReviewDto.content.length>=1){ // 리뷰가 1글자 이상
                let point:Point = new Point();
                point.pointType = pointType.TEXT_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;
                point.point = 1;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            } 
            if(createReviewDto.attachedPhotoIds.length >= 1){ // 사진을 게재
                let point:Point = new Point();
                point.pointType = pointType.PHOTO_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;
                point.point = 1;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            }

            if(!exsistPlaceInfo){
                let point:Point = new Point();
                point.pointType = pointType.PLACE_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;
                point.point = 1;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            }

            return pointList.length;

        } catch(e){
            throw e;
        }
    }

    async reCountPoint(createReviewDto: CreateReviewDto, reviewId:number, queryRunner:QueryRunner):Promise<Point[]>{
        try {

            let pointList:Point[] = [];

            const deletedPointList = await this.deletePoint(reviewId, queryRunner);

            let firstFlag:boolean = false;

            for await(let point of deletedPointList){
                if(point.pointType == 2){ // 첫 장소 보너스
                    const reviewInfo: Review = await Review.findOne({ where: {id: point.reviewId} }); // 해당 리뷰 호출

                    if(reviewInfo.placeUUID == createReviewDto.placeId){
                        firstFlag = true;
                    }
                }
            }

            // 포인트 계산
            if(createReviewDto.content.length>=1){ // 리뷰가 1글자 이상
                let point:Point = new Point();
                point.pointType = pointType.TEXT_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;
                point.point = 1;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            } 
            if(createReviewDto.attachedPhotoIds.length >= 1){ // 사진을 게재
                let point:Point = new Point();
                point.pointType = pointType.PHOTO_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;
                point.point = 1;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            }
            if(firstFlag){
                let point:Point = new Point();
                point.pointType = pointType.PLACE_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;
                point.point = 1;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            }

            return ;
        } catch(e){
            throw e;
        }
    }

    async deletePoint(reviewId:number, queryRunner:QueryRunner):Promise<Point[]>{
        try {
            // 기존 리뷰 포인트 초기화
            const pointList:Point[] = await this.pointRepo.find({where:{reviewId}});

            let resultList: Point[] = [];

            for await(const pointInfo of pointList){
                pointInfo.deletedDate = new Date();
                const result = await queryRunner.manager.save(Point, pointInfo);
                resultList.push(result);
            }

            return resultList;
            
        } catch(e){
            throw e; 
        }
    }

    async countUserPoint(userUUID: string){
        try {

        } catch(e){
            throw e;
        }
    }
}
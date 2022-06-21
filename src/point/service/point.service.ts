import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { CreateReviewDto } from "src/review/dto/create-review.dto";
import { Review } from "src/review/entities/review.entity";
import { QueryRunner } from "typeorm";
import { poitnDetail, userPointResponseDTO } from "../dto/userPoint.response.dto";
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

            const exsistPlaceInfo:Review = await Review.findOne({where: {
                placeUUID:createReviewDto.placeId
            }});

            for await(let point of deletedPointList){
                if(point.pointType == 2){ // 첫 장소 보너스
                    const reviewInfo: Review = await Review.findOne({ where: {id: point.reviewId} }); // 해당 리뷰 호출

                    if(reviewInfo.placeUUID == createReviewDto.placeId){ // 장소가 변경되지 않았는지 체크
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
            if(firstFlag || !exsistPlaceInfo){
                let point:Point = new Point();
                point.pointType = pointType.PLACE_POINT;
                point.reviewId = reviewId;
                point.userUUID = createReviewDto.userId;
                point.point = 1;

                const result = await queryRunner.manager.save(Point,point);

                pointList.push(result);
            }

            return pointList;
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

    async countUserPoint(userUUID: string): Promise<userPointResponseDTO>{
        try {
            let pointList: Point[] = await this.pointRepo.find({where: {userUUID}, relations:['review']});

            if(pointList.length <= 0){
                throw new NotFoundException('해당 유저의 포인트 내역이 존재하지 않습니다.');
            }

            const transFormPointList = pointList.map(
                (point) => {
                    let pointType = "";
                    switch(point.pointType){
                        case 0 : {
                            pointType = "내용 보너스";
                        } break;
                        case 1 : {
                            pointType = "사진 보너스";
                        } break;
                        case 2: {
                            pointType = "첫 장소 보너스";
                        } break;
                        default: {
                            pointType = "알수없음";
                        }
                    }

                    const createdDate = moment(point.createdDate).format("YYYY-MM-DD HH:mm:ss");

                    const info = {
                        reviewId: point.review.reviewUUID,
                        placeId: point.review.placeUUID,
                        reviewType: point.review.type,
                        pointType: pointType,
                        point: point.point,
                        createdDate
                    } as poitnDetail

                    return info;
                }
            )

            const userPoint:number = await this.pointRepo.countUserPoint(userUUID);

            let dto = {
                userId: userUUID,
                totalPoint:userPoint,
                pointList:transFormPointList
            } as userPointResponseDTO;

            return dto;
        } catch(e){
            throw e;
        }
    }
}
import { Test, TestingModule } from "@nestjs/testing"
import { CreateReviewDto } from "src/review/dto/create-review.dto";
import { Review } from "src/review/entities/review.entity";
import { Connection, QueryRunner } from "typeorm";
import { Point } from "../entities/point.entity";
import { pointType } from "../point.enum";
import { PointRepository } from "../point.repository";
import { PointService } from "./point.service";

describe('PointService' , () => {

    let pointService: PointService;
    let pointRepository: PointRepository;
    let connection: Connection;

    const qr = {
        manager: {},
    } as QueryRunner;

    class ConnectionMock {
        createQueryRunner(mode?: "master" | "slave"): QueryRunner{
            return qr;
        }
    }
    
    beforeEach(async () => {
        Object.assign(qr.manager, {
            save: jest.fn(),
            softDelete: jest.fn(),
            findOne: jest.fn(),
        });

        qr.connect = jest.fn();
        qr.release = jest.fn();
        qr.startTransaction = jest.fn();
        qr.commitTransaction = jest.fn();
        qr.rollbackTransaction = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [PointService, PointRepository, {
                provide: Connection,
                useClass: ConnectionMock
            }],
        }).compile();

        pointService = module.get<PointService>(PointService);
        pointRepository = module.get<PointRepository>(PointRepository);
        connection = module.get<Connection>(Connection);

    });

    describe('Type: ADD', () => {
        it('포인트 적립 시 해당 적립 기점이 존재 할때 점수 추가', async () => {

            const reviewId = 1;

            // given 
            let requestDto:CreateReviewDto = {
                "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
                "type": "REVIEW",
                "action": "ADD",
                "content": "",
                "attachedPhotoIds": [],
                "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
                "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f",
                parseToEntity: function (): Promise<Review> {
                    return;
                }
            };

            const exsistReview = Review.of({
                reviewUUID: "240a0658-dc5f-4878-9381-ebb7b2667744",
                id :1 ,
                placeUUID:"2e4baf1c-5acb-4efb-a1af-eddada31b00f",
            });

            const resultPlacePoint = Point.of({
                reviewId,
                pointType:pointType.PLACE_POINT,
                point: 1
            });

            const resultTextPoint = Point.of({
                reviewId,
                pointType:pointType.TEXT_POINT,
                point: 1
            });

            const resultPhotoPoint = Point.of({
                reviewId,
                pointType:pointType.PHOTO_POINT,
                point: 1
            });

            // when 
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValue(exsistReview);

            jest.spyOn(queryRunner.manager, 'save')
                    .mockResolvedValue(resultTextPoint)
                    .mockResolvedValue(resultPhotoPoint)
                    .mockResolvedValue(resultPlacePoint);
            
            const result = await pointService.addPoint(requestDto,reviewId,queryRunner);

            expect(result).toEqual(0);
            
            // 리뷰 작성시 본문 만 존재 할 때
            requestDto.content = "좋아요!";

            const textResult = await pointService.addPoint(requestDto,reviewId,queryRunner);

            expect(textResult).toEqual(1);

            // 리뷰 , 사진 첨부 시
            requestDto.attachedPhotoIds = ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"];

            const photoResult = await pointService.addPoint(requestDto,reviewId,queryRunner);

            expect(photoResult).toEqual(2);

            // 리뷰 작성 , 사진 첨부, 첫 장소 등록
            jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValue(undefined);

            const placeResult = await pointService.addPoint(requestDto,reviewId,queryRunner);

            expect(placeResult).toEqual(3);
        });

    });

    describe('Type: DELETE', () => {
        it('리뷰 삭제시 해당 리뷰에 해당되는 포인트 정보 삭제', async () => {
             // given
             const reviewId:number = 1;

             const queryRunner = connection.createQueryRunner();
             await queryRunner.connect();
             await queryRunner.startTransaction();

             let deleteTextPoint = Point.of({reviewId,point:1,pointType:pointType.TEXT_POINT});
             let deletePhotoPoint = Point.of({reviewId,point:1,pointType:pointType.PHOTO_POINT});
             let deletePlacePoint = Point.of({reviewId,point:1,pointType:pointType.PLACE_POINT});

             const pointList = [
                deleteTextPoint,
                deletePhotoPoint,
                deletePlacePoint,
            ];

             const pointRepoFindSpyOn = jest.spyOn(pointRepository, 'find').mockResolvedValue(pointList);

             // when 
             deleteTextPoint.deletedDate = new Date();
             deletePhotoPoint.deletedDate = new Date();
             deletePlacePoint.deletedDate = new Date();

             jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(deleteTextPoint).mockResolvedValueOnce(deletePhotoPoint).mockResolvedValueOnce(deletePlacePoint);

             const deletedPointList = [
                deleteTextPoint,
                deletePhotoPoint,
                deletePlacePoint,
             ];

             const result = await pointService.deletePoint(reviewId, queryRunner);

             // then 
             expect(result).toEqual(deletedPointList);
             
        });
    });

})
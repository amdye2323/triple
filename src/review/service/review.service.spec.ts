import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, QueryRunner } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entities/review.entity';
import { ReviewRepository } from '../repository/review.repository';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let reviewRepository: ReviewRepository;
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
      providers: [ReviewService, ReviewRepository ,{
        provide: Connection,
        useClass: ConnectionMock
      }],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    connection = module.get<Connection>(Connection);
  });

  describe('Type: ADD', () => {
    it('리뷰 작성 시 이미 작성이 된 리뷰 아이디로 등록시 에러 리턴', async () => {

      // given 
      const requestDto:CreateReviewDto = {
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "type": "REVIEW",
        "action": "ADD",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f",
        parseToEntity: function (): Promise<Review> {
          return;
        }
      };

      const exsitingReview = Review.of({
        "id":1,
        "reviewUUID": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "type": "REVIEW",
        "content": "테스트 입니다.",
        "userUUID": "3dd0ef2-92b7-4817-a5f3-0c575361f745",
        "placeUUID": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
      });

      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // when 
      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(exsitingReview);

      const result = async () => {
        await reviewService.reviewCreate(requestDto,queryRunner);
      }

      // then 
      await expect(result).rejects.toThrowError(
        new BadRequestException('이미 등록 된 리뷰 아이디 입니다.'),
      );

    });

    it('리뷰 작성 시 해당 장소에 해당 유저가 한번이라도 리뷰를 작성했다면 에러 리턴', async () => {
      // given 
      const requestDto:CreateReviewDto = {
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "type": "REVIEW",
        "action": "ADD",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f",
        parseToEntity: function (): Promise<Review> {
          return;
        }
      };

      const exsitingReview = Review.of({
        "id":1,
        "reviewUUID": "240a0658-dc5f-4878-9381-ebb7b2661172",
        "type": "REVIEW",
        "content": "테스트 입니다.",
        "userUUID": "3dd0ef2-92b7-4817-a5f3-0c575361f745",
        "placeUUID": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
      });

      // when 
      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // when 
      jest.spyOn(reviewRepository, 'findOne')
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(exsitingReview);

      // then
      const result = async () => {
        await reviewService.reviewCreate(requestDto, queryRunner);
      } 

      await expect(result).rejects.toThrowError(
        new BadRequestException('해당 유저는 이 장소에 리뷰를 등록한 유저입니다.')
      );

    });

    it('리뷰 작성 시 리뷰를 생성하고 반환한다.', async () => {

      const reviewId = 1;

      const requestDto:CreateReviewDto = {
        reviewId: "240a0658-dc5f-4878-9381-ebb7b2667772",
        type: "REVIEW",
        action: "ADD",
        content: "좋아요!",
        attachedPhotoIds: ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        userId: "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        placeId: "2e4baf1c-5acb-4efb-a1af-eddada31b00f",
        parseToEntity : async () => {
          let reviewInfo:Review = new Review();
        
          reviewInfo.type = "REVIEW";
          reviewInfo.reviewUUID =  "240a0658-dc5f-4878-9381-ebb7b2667772";
          reviewInfo.userUUID = "3ede0ef2-92b7-4817-a5f3-0c575361f745";
          reviewInfo.placeUUID = "2e4baf1c-5acb-4efb-a1af-eddada31b00f";
          reviewInfo.content = "좋아요!";

          return reviewInfo;
        }
      };

      const savedReviewInfo = Review.of({
        reviewUUID:requestDto.reviewId,
        userUUID:requestDto.userId,
        placeUUID:requestDto.placeId,
        content:requestDto.content,
        type:requestDto.type
      });

      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(undefined);

      const reviewRepoSaveSpy = jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(savedReviewInfo);

      const result = await reviewService.reviewCreate(requestDto,queryRunner);

      // expect(reviewRepoSaveSpy).toHaveBeenCalledWith(savedReviewInfo);

      expect(result).toEqual(savedReviewInfo);
    });
  });

  describe('Type: MOD', () => {
    it('생성되지 않은 리뷰 아이디(UUID)가 주어진다면 리뷰를 찾을 수 없다는 예외를 던진다.', async () => {

      const requestDto:CreateReviewDto = {
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "type": "REVIEW",
        "action": "ADD",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f",
        parseToEntity: function (): Promise<Review> {
          return;
        }
      };

      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(undefined);

      const result = async () => {
        await reviewService.reviewUpdate(requestDto, queryRunner);
      }

      await expect(result).rejects.toThrowError(
        new NotFoundException(`일치하는 리뷰가 존재하지 않습니다.`),
      );

      const exsistInfo = Review.of({
        id: 1,
        reviewUUID: "240a0658-dc5f-4878-9381-ebb7b2667772",
        userUUID: "2ede0ef2-92b7-4817-a5f3-0c575361f744",
      });

      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(exsistInfo);

      const idCheckResult = async () => {
        await reviewService.reviewUpdate(requestDto, queryRunner);
      }

      await expect(idCheckResult).rejects.toThrowError(
        new BadRequestException(`수정 요청한 유저의 아이디가 일치 하지 않습니다.`),
      );

    });

    it('존재하는 리뷰 아이디(UUID)가 주어진다면 해당 리뷰를 수정하고 수정된 리뷰를 반환한다.', async () => {

      const reviewId = 1;
      const reviewUUID = "240a0658-dc5f-4878-9381-ebb7b2667772";

      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const requestDto:CreateReviewDto = {
        "reviewId": reviewUUID,
        "type": "REVIEW",
        "action": "ADD",
        "content": "",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f",
        parseToEntity: function (): Promise<Review> {
          return;
        }
      };

      const exsistInfo = Review.of({
        id:reviewId,
        reviewUUID: reviewUUID,
        type: "REVIEW",
        content: "좋아요!",
        userUUID : "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        placeUUID: "2e4baf1c-5acb-4efb-a1af-eddada31b00C",
      });

      const savedInfo = Review.of({
        id:reviewId,
        reviewUUID: reviewUUID,
        type: "REVIEW",
        content: "",
        userUUID : "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        placeUUID: "2e4baf1c-5acb-4efb-a1af-eddada31b00f",
      });

      const reviewRepoFindOneSpy = jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(exsistInfo);
      
      // const reviewRepoSaveSpy = jest.spyOn(reviewRepository, 'save').mockResolvedValue(savedInfo);

      const reviewRepoSaveSpy = jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(savedInfo);

      const result = await reviewService.reviewUpdate(requestDto, queryRunner);

      expect(reviewRepoFindOneSpy).toHaveBeenCalledWith({
        where: {
          reviewUUID:reviewUUID
        }
      });

      expect(result).toEqual(savedInfo);
    });
  });

  describe('Type: DELETE', () => {
    it('생성되지 리뷰 아이디(UUID)가 주어진다면 리뷰를 찾을 수 없다는 예외를 던진다.', async () => {
      const reviewUUID = "240a0658-dc5f-4878-9381-ebb7b2667772";

      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(undefined);

      const result = async () => {
        await reviewService.reviewRemove(reviewUUID,queryRunner);
      }

      await expect(result).rejects.toThrowError(
        new NotFoundException(`일치하는 리뷰가 존재하지 않습니다.`),
      );
    });

    it('존재하는 리뷰 아이디(UUID)가 주어진다면 해당 리뷰를 삭제(deleteDate 주입)하고 해당 리뷰를 반환한다.', async () => {

      const reviewUUID = "240a0658-dc5f-4878-9381-ebb7b2667772";

      const deleteInfo = Review.of({
        id:1,
        reviewUUID: reviewUUID,
        type: "REVIEW",
        content: "좋아요!",
        userUUID : "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        placeUUID: "2e4baf1c-5acb-4efb-a1af-eddada31b00C",
        deletedDate: new Date("2022-05-05 00:00:00")
      })

      const queryRunner = connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // const reviewRepoFindOneSpy = jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(exsistInfo);

      jest.spyOn(reviewRepository, 'findOne').mockResolvedValue(deleteInfo);
      // jest.spyOn(queryRunner.manager, 'softDelete').mockResolvedValue({
      //   raw : 1,
      //   generatedMaps : null
      // });

      deleteInfo.deletedDate = new Date();

      jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(deleteInfo);

      const result = await reviewService.reviewRemove(reviewUUID,queryRunner);

      expect(result).toEqual(deleteInfo);

    });
  })
  
});

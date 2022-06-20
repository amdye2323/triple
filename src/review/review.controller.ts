import { Controller, Get, Post, Body, Patch, Param, Delete, Injectable, Res, BadRequestException } from '@nestjs/common';
import { ReviewService } from './service/review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Connection } from 'typeorm';
import { Review } from './entities/review.entity';
import { PointService } from 'src/point/service/point.service';
import { PhotoService } from './service/photo.service';

@Controller('events')
export class ReviewController {
  constructor(
     private readonly reviewService: ReviewService,
     private readonly pointService: PointService,
     private readonly photoService: PhotoService,
     private readonly connection: Connection
    ) {}

  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Res() res
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      // 리뷰 처리
      const reviewAction = createReviewDto.action;

      let reviewId = null;

      switch(reviewAction){
        case "ADD" : {

          const reviewInfo:Review = await this.reviewService.reviewCreate(createReviewDto,queryRunner);
          // 사진 등록
          await this.photoService.addPhotos(createReviewDto, reviewInfo.id, queryRunner);
          // 포인트 처리
          await this.pointService.addPoint(createReviewDto, reviewInfo.id, queryRunner);

          reviewId = reviewInfo.id;
        } break;
        case "MOD" : {

          const reviewInfo:Review = await this.reviewService.reviewUpdate(createReviewDto, queryRunner);
          // 사진 처리
          await this.photoService.resetPhotos(createReviewDto, reviewInfo.id, queryRunner);
          // 포인트 처리
          await this.pointService.reCountPoint(createReviewDto, reviewInfo.id, queryRunner);

          reviewId = reviewInfo.id;
        } break;
        case "DELETE" : {

          const reviewInfo:Review = await this.reviewService.reviewRemove(createReviewDto.reviewId, queryRunner);
          // 사진 삭제 처리
          await this.photoService.removePhotos(reviewInfo.id, queryRunner);
          // 포인트 삭제 처리
          await this.pointService.deletePoint(reviewInfo.id, queryRunner);

          reviewId = reviewInfo.id;
        } break;
        default : throw new BadRequestException(`잘못된 리뷰 요청 입니다.`);
      }
      
      await queryRunner.commitTransaction();

      const resultInfo = await Review.findOne(reviewId , {relations: ['photos','pointList']});

      return res.status(201).json({
        message: '해당 리뷰 요청이 성공적으로 완료되었습니다.',
        data: resultInfo
      });
    } catch(e){

      await queryRunner.rollbackTransaction();

      return res.status(e.response.statusCode).json({
        message: e.response.message,
        data: createReviewDto
      });
    }
    finally {
      await queryRunner.release();
    }
  }

}

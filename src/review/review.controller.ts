import { Controller, Get, Post, Body, Patch, Param, Delete, Injectable, Res, BadRequestException } from '@nestjs/common';
import { ReviewService } from './service/review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Connection } from 'typeorm';
import { Review } from './entities/review.entity';

@Controller('events')
export class ReviewController {
  constructor(
     private readonly reviewService: ReviewService,
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

      switch(reviewAction){
        case "ADD" : {
          const reviewInfo:Review = await this.reviewService.reviewCreate(createReviewDto,queryRunner);
          // 포인트 처리

        } break;
        case "MOD" : {
          const reviewInfo:Review = await this.reviewService.reviewUpdate(createReviewDto, queryRunner);
          // 포인트 처리
        } break;
        case "DELETE" : {
          const reviewInfo:Review = await this.reviewService.reviewRemove(createReviewDto.reviewId, queryRunner);
          // 포인트 처리
        } break;
        default : throw new BadRequestException(`잘못된 리뷰 요청 입니다.`);
      }
      
      await queryRunner.commitTransaction();

      return res.status(201).json({
        message: '리뷰 등록이 성공적으로 완료되었습니다.'
      });
    } catch(e){
      return res.status(401).json({
        message: e,
        data: createReviewDto
      });
    }
  }

}

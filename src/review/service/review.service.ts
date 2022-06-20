import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entities/review.entity';
import { ReviewRepository } from '../repository/review.repository';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(ReviewRepository) private readonly reviewRepo:ReviewRepository
  ){}

  async reviewCreate(createReviewDto: CreateReviewDto, queryRunner: QueryRunner) {
    try {

      const reviewUUID = createReviewDto.reviewId;

      const exsistInfo = await this.reviewRepo.findOne({where:{reviewUUID}});

      if(exsistInfo){
        throw new BadRequestException('이미 등록 된 리뷰 아이디 입니다.');
      }

      const placeInfo = await this.reviewRepo.findOne({where: [
        { userUUID: createReviewDto.userId },
        { placeUUID: createReviewDto.placeId }
      ]});

      if(placeInfo){
        throw new BadRequestException('해당 유저는 이 장소에 리뷰를 등록한 유저입니다.');
      }

      const reviewAddInfo = await createReviewDto.parseToEntity();

      const savedInfo = await queryRunner.manager.save(Review,reviewAddInfo);

      if(!savedInfo){
        throw new BadRequestException('리뷰 등록 중 오류가 발생했습니다.');
      }

      return savedInfo;

    } catch(e){
      throw e;
    }
  }

  async reviewUpdate(updateReviewDto: CreateReviewDto, queryRunner: QueryRunner):Promise<Review> {
    try {
      const reviewUUID:string = updateReviewDto.reviewId;

      const exsistInfo = await this.reviewRepo.findOne({where:{reviewUUID}}); 

      if(!exsistInfo) {
        throw new NotFoundException(`일치하는 리뷰가 존재하지 않습니다.`);
      }
      
      if(exsistInfo.userUUID !== updateReviewDto.userId){
        throw new BadRequestException(`수정 요청한 유저의 아이디가 일치 하지 않습니다.`);
      } 
      
      exsistInfo.content = updateReviewDto.content;
      exsistInfo.placeUUID = updateReviewDto.placeId;

      const updateInfo = await queryRunner.manager.save(Review,exsistInfo);

      return updateInfo;
    } catch(e){
      throw e;
    }
  }

  async reviewRemove(reviewUUID: string, queryRunner: QueryRunner):Promise<Review> {
    try {
      const exsistInfo = await this.reviewRepo.findOne({where:{reviewUUID}}); 

      if(!exsistInfo)throw new NotFoundException(`일치하는 리뷰가 존재하지 않습니다.`);

      await queryRunner.manager.softDelete(Review,exsistInfo);

      const result = await this.reviewRepo.findOne({where:{reviewUUID}, withDeleted: true});

      return result;

    } catch(e){
      throw e;
    }
  }
}

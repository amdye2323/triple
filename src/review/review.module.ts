import { Module } from '@nestjs/common';
import { ReviewService } from './service/review.service';
import { ReviewController } from './review.controller';
import { PointModule } from 'src/point/point.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from './repository/review.repository';
import { PointService } from 'src/point/service/point.service';
import { PhotoService } from './service/photo.service';
import { PhotoRepository } from './repository/photo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRepository,PhotoRepository]),PointModule],
  controllers: [ReviewController],
  providers: [ReviewService, PhotoService],
  exports: [ReviewService, TypeOrmModule.forFeature()]
})
export class ReviewModule {}

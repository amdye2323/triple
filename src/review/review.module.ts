import { Module } from '@nestjs/common';
import { ReviewService } from './service/review.service';
import { ReviewController } from './review.controller';
import { PointModule } from 'src/point/point.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from './repository/review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRepository])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}

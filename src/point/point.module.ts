import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewRepository } from "src/review/repository/review.repository";
import { PointRepository } from "./point.repository";
import { PointService } from "./service/point.service";

@Module({
    imports: [TypeOrmModule.forFeature([PointRepository,ReviewRepository])],
    providers: [PointService],
    exports: [PointService,TypeOrmModule.forFeature()]
})
export class PointModule{}
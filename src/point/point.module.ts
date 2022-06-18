import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PointRepository } from "./point.repository";
import { PointService } from "./service/point.service";

@Module({
    imports: [TypeOrmModule.forFeature([PointRepository])],
    providers: [PointService],
    exports: [PointService,TypeOrmModule.forFeature()]
})
export class PointModule{}
import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Connection } from "typeorm";
import { userPointResponseDTO } from "./dto/userPoint.response.dto";
import { PointService } from "./service/point.service";

@Controller('points')
export class PointController{
    constructor(
        private readonly pointService: PointService
    ){}
    
    @Get()
    async getUserPoint(
        @Query('userId') userId: string,
        @Res() res
    ){
        try {
            const userUUID: string = userId;

            const userCountDto:userPointResponseDTO = await this.pointService.countUserPoint(userUUID);
            
            return res.status(200).json(userCountDto);
        } catch(e){
            return res.status(400).json({
                message: e.response?.message??"알 수 없는 오류입니다.",
            });
        } 
    }
}
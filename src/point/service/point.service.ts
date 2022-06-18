import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PointRepository } from "../point.repository";

@Injectable()
export class PointService{
    constructor(
        @InjectRepository(PointRepository) private readonly pointRepo:PointRepository
    ){}
}
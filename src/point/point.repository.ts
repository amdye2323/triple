import { EntityRepository, Repository } from "typeorm";
import { Point } from "./entities/point.entity";

@EntityRepository(Point)
export class PointRepository extends Repository<Point> {
    
}
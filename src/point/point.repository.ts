import { EntityRepository, Repository } from "typeorm";
import { Point } from "./entities/point.entity";

@EntityRepository(Point)
export class PointRepository extends Repository<Point> {
    async countUserPoint(userUUID: string):Promise<number>{
        try {

            const qb = await this.createQueryBuilder('p')
                                    .select('sum(p.point) as point')
                                    .where(`p.userUUID = :userUUID`, {userUUID})
                                    .getRawOne();
            return qb.point;
        } catch(e){
            throw e;
        }
    }
}
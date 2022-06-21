import { Point } from "../entities/point.entity";

export class userPointResponseDTO {

    userId: string;

    totalPoint: number;

    pointList: poitnDetail[]

}

export class poitnDetail {

    reviewId: string;

    placeId: string;

    reviewType: string;

    pointType: string;

    point: 1

    createdDate: string;
}
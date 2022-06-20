import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Review } from "../entities/review.entity";

export class CreateReviewDto {

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    action: string;
    
    @IsNotEmpty()
    @IsString()
    reviewId: string;

    @IsString()
    content: string;

    attachedPhotoIds: string[];

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    placeId: string;

    // 리뷰 객체 생성
    async parseToEntity():Promise<Review>{
        let reviewInfo:Review = new Review();
        
        reviewInfo.type = this.type;
        reviewInfo.reviewUUID = this.reviewId;
        reviewInfo.userUUID = this.userId;
        reviewInfo.placeUUID = this.placeId;
        reviewInfo.content = this.content;

        return reviewInfo;
    }
}

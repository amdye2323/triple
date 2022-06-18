import { Test, TestingModule } from '@nestjs/testing';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRepository } from './repository/review.repository';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let service: ReviewService;
  let repository: ReviewRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService, ReviewRepository],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    repository = module.get<ReviewRepository>(ReviewRepository);
  });

  describe('Type: ADD', () => {
    it('리뷰 작성 시 이미 작성이 된 리뷰 아이디로 등록시 에러 리턴', async () => {

      // const reviewId:string = "240a0658-dc5f-4878-9381-ebb7b2667772";

      const requestDto = {
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "type": "REVIEW",
        "action": "ADD",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
      };


      // expect(service).toBeDefined();
    });


  })

  
});

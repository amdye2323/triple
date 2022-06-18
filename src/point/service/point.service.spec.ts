import { Test, TestingModule } from "@nestjs/testing"

describe('PointService' , () => {

    let pointService = null;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: []
        }).compile();

    })
})
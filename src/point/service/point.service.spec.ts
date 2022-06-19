import { Test, TestingModule } from "@nestjs/testing"

describe('PointService' , () => {

    let pointService = null;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: []
        }).compile();

    });

    it('test', async () => {
        expect(1 + 1).toEqual(2);
    });
})
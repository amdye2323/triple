import { Test, TestingModule } from "@nestjs/testing"
import { Connection, QueryRunner } from "typeorm";
import { PointRepository } from "../point.repository";
import { PointService } from "./point.service";

describe('PointService' , () => {

    let pointService: PointService;
    let pointRepository: PointRepository;
    let connection: Connection;

    const qr = {
        manager: {},
    } as QueryRunner;

    class ConnectionMock {
        createQueryRunner(mode?: "master" | "slave"): QueryRunner{
            return qr;
        }
    }
    
    beforeEach(async () => {
        Object.assign(qr.manager, {
            save: jest.fn(),
            softDelete: jest.fn(),
            findOne: jest.fn(),
        });

        qr.connect = jest.fn();
        qr.release = jest.fn();
        qr.startTransaction = jest.fn();
        qr.commitTransaction = jest.fn();
        qr.rollbackTransaction = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [PointService, PointRepository, {
                provide: Connection,
                useClass: ConnectionMock
            }],
        }).compile();

        pointService = module.get<PointService>(PointService);
        pointRepository = module.get<PointRepository>(PointRepository);
        connection = module.get<Connection>(Connection);

    });

    describe('Type: ADD', () => {
        it('해당 내용이 존재 할때 점수 추가', async () => {

        });

        it('')
    });

    describe('Type: MOD', () => {

    });

    describe('Type: DELETE', () => {

    })
})
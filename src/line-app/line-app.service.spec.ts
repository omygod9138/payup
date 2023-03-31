import { Test, TestingModule } from '@nestjs/testing';
import { LineAppService } from './line-app.service';

describe('LineAppService', () => {
  let service: LineAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineAppService],
    }).compile();

    service = module.get<LineAppService>(LineAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LineAppController } from './line-app.controller';
import { LineAppService } from './line-app.service';

describe('LineAppController', () => {
  let controller: LineAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineAppController],
      providers: [LineAppService],
    }).compile();

    controller = module.get<LineAppController>(LineAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

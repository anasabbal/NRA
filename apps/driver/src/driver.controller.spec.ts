import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

describe('DriverController', () => {
  let driverController: DriverController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [DriverService],
    }).compile();

    driverController = app.get<DriverController>(DriverController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(driverController.getHello()).toBe('Hello World!');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';

describe('RideController', () => {
  let rideController: RideController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [RideService],
    }).compile();

    rideController = app.get<RideController>(RideController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rideController.getHello()).toBe('Hello World!');
    });
  });
});

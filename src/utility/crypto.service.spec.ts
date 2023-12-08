import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  describe('bcryptCompare', () => {
    const mockPassword = 'test_password';

    it('should return truth in comparing with hash', async () => {
      const hash = await service.generateHashedPassword(mockPassword);
      const result = await service.bcryptCompare(mockPassword, hash);
      expect(result).toBeTruthy();
    });

    it('should return false in comparing with hash', async () => {
      const hash = await service.generateHashedPassword('qweqe');
      const result = await service.bcryptCompare(mockPassword, hash);
      expect(result).toBeFalsy();
    });
  });
});

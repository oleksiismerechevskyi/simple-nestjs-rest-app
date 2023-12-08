import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const validator = new Validator();
  const mockCreateUserDto: CreateUserDto = {
    username: 'username',
    password: 'Passw0rd1',
  };

  beforeEach(() => {
    Object.assign(mockCreateUserDto, {
      username: 'username',
      password: 'Passw0rd1',
    });
  });

  it('should return an error for minimal username length', async () => {
    mockCreateUserDto.username = 'cat';
    const transformedDto = plainToClass(CreateUserDto, mockCreateUserDto);
    const [validationError] = await validator.validate(transformedDto);
    expect(validationError.constraints.minLength).toBeDefined();
  });

  it('should return an error for minimal password length', async () => {
    mockCreateUserDto.password = '123';
    const transformedDto = plainToClass(CreateUserDto, mockCreateUserDto);
    const [validationError] = await validator.validate(transformedDto);
    expect(validationError.constraints.minLength).toBeDefined();
  });

  it('should return an error for password regular expression', async () => {
    mockCreateUserDto.password = '1234567';
    const transformedDto = plainToClass(CreateUserDto, mockCreateUserDto);
    const [validationError] = await validator.validate(transformedDto);
    expect(validationError.constraints.matches).toBeDefined();
  });
});

import { Validator } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { plainToClass } from 'class-transformer';

describe('CreateTaskDto', () => {
  const validator = new Validator();
  const mockCreateTaskDto: CreateTaskDto = {
    title: 'task-title',
    description: 'task-description',
  };

  beforeEach(() => {
    Object.assign(mockCreateTaskDto, {
      title: 'task-title',
      description: 'task-description',
    });
  });

  it('should return an error for empty title', async () => {
    mockCreateTaskDto.title = null;
    const transformedDto = plainToClass(CreateTaskDto, mockCreateTaskDto);
    const [validationError] = await validator.validate(transformedDto);
    expect(validationError.constraints.isNotEmpty).toBeDefined();
  });

  it('should return an error for empty description', async () => {
    mockCreateTaskDto.description = null;
    const transformedDto = plainToClass(CreateTaskDto, mockCreateTaskDto);
    const [validationError] = await validator.validate(transformedDto);
    expect(validationError.constraints.isNotEmpty).toBeDefined();
  });
});

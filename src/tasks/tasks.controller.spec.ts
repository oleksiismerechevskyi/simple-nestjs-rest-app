import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { User } from 'src/users/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTasksService = () => ({
  deleteTask: jest.fn(),
  getTask: jest.fn(),
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
});

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: ReturnType<typeof mockTasksService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useFactory: mockTasksService }],
    }).compile();

    tasksService = module.get(TasksService);
    tasksController = module.get(TasksController);
  });

  describe('GetTasks', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    const mockTask: Task = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      title: 'title',
      description: 'descir',
      status: TaskStatus.OPEN,
      user: mockUser,
    };

    it('should return tasks', async () => {
      tasksService.getTasks.mockResolvedValueOnce([mockTask]);
      const result = await tasksController.getTasks(null, mockUser);
      expect(result).toEqual([mockTask]);
    });

    it('should return empty array', async () => {
      tasksService.getTasks.mockResolvedValueOnce([]);
      const result = await tasksController.getTasks(null, mockUser);
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    const mockTask: Task = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      title: 'title',
      description: 'descir',
      status: TaskStatus.OPEN,
      user: mockUser,
    };

    it('should return a task', async () => {
      tasksService.getTask.mockResolvedValueOnce(mockTask);
      const result = await tasksController.getTaskById(
        'a86643c6-c0d5-4396-b3e2-8ab29d529272',
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });

    it('should return an error', async () => {
      tasksService.getTask.mockResolvedValueOnce(null);
      try {
        await tasksController.getTaskById('someid', mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteTaskById', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    const mockTask: Task = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      title: 'title',
      description: 'descir',
      status: TaskStatus.OPEN,
      user: mockUser,
    };

    it('should return deleted task', async () => {
      tasksService.deleteTask.mockReturnValue(mockTask);
      const result = await tasksController.deleteTaskById(
        mockTask.id,
        mockTask.user,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    const mockTask: Task = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      title: 'title',
      description: 'descir',
      status: TaskStatus.OPEN,
      user: mockUser,
    };

    const mockCreateTaskDto: CreateTaskDto = {
      title: 'mocked title',
      description: 'mocked description',
    };

    it('should return created task', async () => {
      tasksService.createTask.mockReturnValue(mockTask);
      const result = await tasksController.createTask(
        mockCreateTaskDto,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    const mockUser: User = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      username: 'Oleksii',
      password: '12345678a',
      tasks: [],
    };

    const mockTask: Task = {
      id: 'a86643c6-c0d5-4396-b3e2-8ab29d529272',
      title: 'title',
      description: 'descir',
      status: TaskStatus.OPEN,
      user: mockUser,
    };

    const mockUpdateTaskDto: UpdateTaskDto = {
      status: TaskStatus.OPEN,
    };

    const mockTaskId = 'a86643c6-c0d5-4396-b3e2-8ab29d529272';

    it('should return updated task', async () => {
      tasksService.updateTask.mockReturnValue(mockTask);
      const result = await tasksController.updateTaskById(
        mockTaskId,
        mockUpdateTaskDto,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });
});

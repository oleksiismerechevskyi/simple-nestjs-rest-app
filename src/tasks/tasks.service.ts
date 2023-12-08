/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../users/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private repository: TasksRepository) {}

  public async getTasks(dto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.repository.getTaskWithFilters(dto, user);
  }

  public async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    return this.repository.createTask(dto, user);
  }

  public async getTask(inputid: string, user: User): Promise<Task> {
    const task = await this.repository.findOneBy({ id: inputid, user });

    if (!task) {
      throw new NotFoundException(`${inputid} task not found`);
    }

    return task;
  }

  public async deleteTask(id: string, user: User): Promise<Task> {
    const task = await this.getTask(id, user);
    await this.repository.delete({ id, user });
    return task;
  }

  public async updateTask(
    id: string,
    dto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const found = await this.getTask(id, user);
    found.status = dto.status ?? found.status;
    return this.repository.save(found);
  }
}

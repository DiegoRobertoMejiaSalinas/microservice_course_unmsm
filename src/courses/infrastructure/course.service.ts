import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, Observer } from 'rxjs';
import { CourseEntity } from 'src/entities/course.entity';
import { In } from 'typeorm';
import { CreateCourseDto } from '../domain/dto/create-course.dto';
import { UpdateCourseDto } from '../domain/dto/update-course.dto';
import { CourseRepository } from './repositories/course.repository';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly _courseRepository: CourseRepository,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    this.userClient.connect();
  }

  async listAllCourses() {
    return await this._courseRepository.find();
  }

  async getCoursesByUserId(userId: number) {
    return await this._courseRepository.find({
      where: {
        coursesUsers: {
          userId,
        },
      },
    });
  }

  async findCourseById(courseId: number) {
    const foundCourse = await this._courseRepository.findOne({
      relations: {
        coursesUsers: true,
      },
      where: {
        id: courseId,
      },
    });

    if (!foundCourse) return null;

    const enrolledUsers = await lastValueFrom(
      this.userClient.send(
        'users_by_array_id',
        foundCourse.coursesUsers.map((t) => t.userId),
      ),
    );

    foundCourse.users = enrolledUsers || [];

    return foundCourse;
  }

  async createCourse(body: CreateCourseDto) {
    try {
      const previouslyCourseName = await this._courseRepository.findOne({
        where: {
          name: body.name,
        },
      });

      if (previouslyCourseName) {
        throw new BadRequestException({
          error: {
            type: 'already_used_name',
            message: 'El nombre del curso se ha utilizado previamente',
          },
        });
      }

      await this._courseRepository.save({
        ...body,
      });

      return {
        success: true,
        message: 'Course created successfully',
      };
    } catch (e) {
      if (e?.response?.error?.type) throw e;

      throw new InternalServerErrorException({
        error: {
          type: 'error_creating_user',
          message: 'Hubo un error al crear el curso',
        },
      });
    }
  }

  async updateCourse(courseId: number, body: UpdateCourseDto) {
    await this._courseRepository.save({
      id: courseId,
      ...body,
    });

    return {
      success: true,
      message: 'Course updated successfully',
    };
  }

  async deleteCourse(courseId: number) {
    return await this._courseRepository.delete({
      id: courseId,
    });
  }
}

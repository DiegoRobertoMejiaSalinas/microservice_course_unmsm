import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from 'src/entities/course.entity';
import { CreateCourseDto } from '../domain/dto/create-course.dto';
import { UpdateCourseDto } from '../domain/dto/update-course.dto';
import { CourseRepository } from './repositories/course.repository';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly _courseRepository: CourseRepository,
  ) {}

  async listAllCourses() {
    return await this._courseRepository.find();
  }

  async findCourseById(courseId: number) {
    return await this._courseRepository.findOne({
      where: {
        id: courseId,
      },
    });
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

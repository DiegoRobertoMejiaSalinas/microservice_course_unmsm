import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, lastValueFrom, Observer, throwError } from 'rxjs';
import { CourseRepository } from 'src/courses/infrastructure/repositories/course.repository';
import { CourseUserEntity } from 'src/entities/course-user.entity';
import { CourseEntity } from 'src/entities/course.entity';
import {
  CreateEnrollmentDto,
  DeleteEnrollmentDto,
} from '../domain/dto/create-enrollment.dto';
import { CourseUserRepository } from './repositories/course-user.repository';

@Injectable()
export class CourseUserService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly _courseRepository: CourseRepository,
    @InjectRepository(CourseUserEntity)
    private readonly _enrollmentRepository: CourseUserRepository,
    @Inject('USER_SERVICE')
    private userClient: ClientProxy,
  ) {}

  listAllEnrolled() {}

  getEnrollmentById() {}

  async createEnrollment(body: CreateEnrollmentDto) {
    try {
      /*
       * Vemos si el curso existe
       */
      const isExistingCourse = await this._courseRepository.findOne({
        where: {
          id: body.course_id,
        },
      });

      if (!isExistingCourse) {
        throw new NotFoundException({
          error: {
            type: 'not_existing_course',
            message: 'El curso que intenta matricular no existe',
          },
        });
      }

      /*
       * Verificamos que exista el usuario
       */

      const foundUser = await lastValueFrom(
        this.userClient.send('get_user_by_id', body.user_id),
      );
      if (!foundUser) {
        throw new NotFoundException({
          error: {
            type: 'not_existing_user',
            message: 'El usuario al que intenta matricular no existe',
          },
        });
      }

      /*
       * Verificamos que no existe otro registro igual
       */
      const isOtherSameExisting = await this._enrollmentRepository.findOne({
        where: {
          course: {
            id: body.course_id,
          },
          userId: body.user_id,
        },
      });

      if (isOtherSameExisting) {
        throw new ForbiddenException({
          error: {
            type: 'already_existing_enrollment',
            message: 'Esta matricula ya existe',
          },
        });
      }

      return this._enrollmentRepository.save({
        course: {
          id: body.course_id,
        },
        userId: body.user_id,
      });
    } catch (e) {
      throw e;
    }
  }

  async deleteEnrollment(enrollmentId: number) {
    try {
      /*
       * Verificamos que existe el registro igual
       */
      const isEnrollmentExisting = await this._enrollmentRepository.findOne({
        where: {
          id: enrollmentId,
        },
      });

      if (!isEnrollmentExisting) {
        throw new NotFoundException({
          error: {
            type: 'not_existing_enrollment',
            message: 'La matricula que intenta eliminar no existe',
          },
        });
      }

      await this._enrollmentRepository.delete({
        id: enrollmentId,
      });

      return {
        success: true,
        message: 'La matricula ha sido eliminada exitosamente',
      };
    } catch (e) {
      if (e?.response?.error?.type) throw e;

      throw new InternalServerErrorException({
        error: {
          type: 'error_deleting_enrollment',
          message: 'Ocurrio un error al eliminar la matricula',
        },
      });
    }
  }

  async deleteEnrollmentByBody(body: DeleteEnrollmentDto) {
    try {
      /*
       * Vemos si el curso existe
       */
      const isExistingCourse = await this._courseRepository.findOne({
        where: {
          id: body.course_id,
        },
      });

      if (!isExistingCourse) {
        throw new NotFoundException({
          error: {
            type: 'not_existing_course',
            message: 'El curso que intenta eliminar la matricula no existe',
          },
        });
      }

      /*
       * Verificamos que exista el usuario
       */

      const foundUser = await lastValueFrom(
        this.userClient.send('get_user_by_id', body.user_id),
      );
      if (!foundUser) {
        throw new NotFoundException({
          error: {
            type: 'not_existing_user',
            message:
              'El usuario al que intenta eliminar la matricula no existe',
          },
        });
      }

      /*
       * Verificamos que existe el registro igual
       */
      const isEnrollmentExisting = await this._enrollmentRepository.findOne({
        where: {
          course: {
            id: body.course_id,
          },
          userId: body.user_id,
        },
      });

      if (!isEnrollmentExisting) {
        throw new NotFoundException({
          error: {
            type: 'not_existing_enrollment',
            message: 'La matricula que intenta eliminar no existe',
          },
        });
      }

      await this._enrollmentRepository.delete({
        course: {
          id: body.course_id,
        },
        userId: body.user_id,
      });

      return {
        success: true,
        message: 'La matricula ha sido eliminada exitosamente',
      };
    } catch (e) {
      throw e;
    }
  }
}

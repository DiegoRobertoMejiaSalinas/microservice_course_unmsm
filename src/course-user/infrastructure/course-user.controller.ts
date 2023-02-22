import {
  Body,
  Controller,
  Delete,
  Inject,
  OnApplicationShutdown,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentDto } from '../domain/dto/create-enrollment.dto';
import { CourseUserService } from './course-user.service';

@ApiTags('Enrollment')
@Controller('enrollment')
export class CourseUserController implements OnApplicationShutdown {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly courseUserService: CourseUserService,
  ) {}
  onApplicationShutdown(signal?: string) {
    this.userClient.close();
  }

  @Post()
  async createEnrollment(@Body() body: CreateEnrollmentDto) {
    return await this.courseUserService.createEnrollment(body);
  }

  @Delete(':id')
  async deleteEnrollment(@Param('id') enrollmentId: number) {
    return await this.courseUserService.deleteEnrollment(enrollmentId);
  }
}

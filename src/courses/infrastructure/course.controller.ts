import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { CourseEntity } from 'src/entities/course.entity';
import { CreateCourseDto } from '../domain/dto/create-course.dto';
import { UpdateCourseDto } from '../domain/dto/update-course.dto';
import { CourseService } from './course.service';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getAllCourses() {
    return await this.courseService.listAllCourses();
  }

  @Get(':id')
  async findCourseById(@Param('id') courseId: number) {
    return await this.courseService.findCourseById(courseId);
  }

  @Post()
  async createCourse(@Body() body: CreateCourseDto) {
    return await this.courseService.createCourse(body);
  }

  @Put(':id')
  async updateCourse(
    @Param('id') courseId: number,
    @Body() body: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(courseId, body);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') courseId: number) {
    return await this.courseService.deleteCourse(courseId);
  }

  @MessagePattern('courses_by_user_id')
  public async getCoursesByUserId(
    @Payload() data: number,
  ): Promise<CourseEntity[]> {
    return await this.courseService.getCoursesByUserId(data);
  }
}

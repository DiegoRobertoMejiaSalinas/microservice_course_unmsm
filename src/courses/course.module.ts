import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from 'src/entities/course.entity';
import { UserController } from './infrastructure/course.controller';
import { CourseService } from './infrastructure/course.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity])],
  providers: [CourseService],
  exports: [TypeOrmModule],
  controllers: [UserController]
})
export class CourseModule {}

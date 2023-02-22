import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/courses/course.module';
import { CourseUserEntity } from 'src/entities/course-user.entity';
import { CourseEntity } from 'src/entities/course.entity';
import { CourseUserController } from './infrastructure/course-user.controller';
import { CourseUserService } from './infrastructure/course-user.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CourseUserEntity]),
    CourseModule,
  ],
  providers: [
    CourseUserService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const connection = configService.get('RABBITMQ_CONNECTION');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [connection],
            queue: 'user_queue',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [TypeOrmModule],
  controllers: [CourseUserController],
})
export class CourseUserModule {}

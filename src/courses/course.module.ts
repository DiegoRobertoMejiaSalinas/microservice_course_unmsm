import { Module } from '@nestjs/common';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from 'src/entities/course.entity';
import { CourseController } from './infrastructure/course.controller';
import { CourseService } from './infrastructure/course.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CourseEntity])],
  providers: [
    CourseService,
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
  controllers: [CourseController],
})
export class CourseModule {}

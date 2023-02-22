import { UserModelClass } from 'src/models-classes/user.class';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity({
  name: 'course_user',
})
export class CourseUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CourseEntity, (course) => course.coursesUsers)
  @JoinColumn({
    name: 'course_id',
  })
  course: CourseEntity;

  @Column({
    name: 'user_id',
    nullable: false,
  })
  userId: number;

  user: UserModelClass
}

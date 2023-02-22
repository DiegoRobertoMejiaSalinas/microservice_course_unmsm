import { UserModelClass } from 'src/models-classes/user.class';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { CourseUserEntity } from './course-user.entity';

@Entity({
  name: 'course',
})
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(() => CourseUserEntity, (courseUser) => courseUser.course)
  coursesUsers: CourseUserEntity[];

  users: UserModelClass[]
}

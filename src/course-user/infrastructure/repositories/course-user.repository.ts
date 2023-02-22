import { Injectable } from "@nestjs/common";
import { CourseUserEntity } from "src/entities/course-user.entity";
import { Repository } from "typeorm";

@Injectable()
export class CourseUserRepository extends Repository<CourseUserEntity>{}
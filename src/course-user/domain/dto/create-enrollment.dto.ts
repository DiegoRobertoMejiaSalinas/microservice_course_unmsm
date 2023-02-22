import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  course_id: number;
}


export class DeleteEnrollmentDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  course_id: number;
}

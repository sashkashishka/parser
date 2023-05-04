import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(4)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

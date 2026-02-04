import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    },
    {
      message:
        'Password is too weak. It must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.',
    },
  )
  password: string;
  @IsString()
  @MinLength(2)
  fullName: string;
}

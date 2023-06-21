import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class UserDTO {
  id?: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  avatar?: string;

  @ApiProperty({ default: 'LÊ THỊ THUỲ LINH' })
  @Matches(/\D+/g, { message: 'Invalid name!' })
  name: string;

  @ApiProperty({ default: 'thuylinh7524@gmail.com' })
  @IsEmail(undefined, { message: 'Invalid email!' })
  email: string;

  @ApiProperty({ default: 'Thuylinh@7524' })
  password: string;

  @ApiProperty({ default: '0975318642' })
  @IsNumberString(undefined, { message: 'Invalid phone number!' })
  phone: string;

  @ApiProperty({ default: new Date('2004-05-07').toISOString() })
  @IsDateString(undefined, { message: 'Invalid date string!' })
  birthday: Date;

  @ApiProperty({ enum: ['Male', 'Female', 'Undefined'] })
  @IsString()
  gender: 'Male' | 'Female' | 'Undefined';

  @ApiProperty({ enum: ['Guest', 'Admin'] })
  @IsString()
  role: 'Guest' | 'Admin';
}

export class UserUpdateDTO {
  @ApiPropertyOptional()
  @Matches(/\D+/g, { message: 'Invalid name!' })
  name: string;

  @ApiPropertyOptional()
  @IsEmail(undefined, { message: 'Invalid email!' })
  email: string;

  @ApiPropertyOptional()
  @IsNumberString(undefined, { message: 'Invalid phone number!' })
  phone: string;

  @ApiPropertyOptional()
  @IsDateString(undefined, { message: 'Invalid date string!' })
  birthday: Date;

  @ApiPropertyOptional({ enum: ['Male', 'Female', 'Undefined'] })
  @IsString()
  gender: 'Male' | 'Female' | 'Undefined';

  @ApiPropertyOptional({ enum: ['Guest', 'Admin'] })
  @IsString()
  role: 'Guest' | 'Admin';

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  avatar: string;
}

export class SignUpDTO {
  @ApiProperty()
  @Matches(/\D+/g, { message: 'Invalid name!' })
  name: string;

  @ApiProperty()
  @IsEmail(undefined, { message: 'Invalid email!' })
  email: string;

  @ApiProperty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain: minimum 8 characters, a digit, an uppercase, a lowercase and a special characters!',
    },
  )
  password: string;

  @ApiProperty()
  @IsNumberString(undefined, { message: 'Invalid phone number!' })
  phone: string;

  @ApiProperty({
    default: new Date().toISOString(),
  })
  @IsDateString(undefined, { message: 'Invalid date string!' })
  birthday: Date;

  @ApiProperty({ enum: ['Male', 'Female', 'Undefined'] })
  @IsString()
  gender: 'Male' | 'Female' | 'Undefined';
}

export class SignInDTO {
  @ApiProperty({ default: 'quocanh1724@gmail.com' })
  @IsEmail(undefined, { message: 'Invalid email address!' })
  email: string;

  @ApiProperty({ default: 'Quocanh@1724' })
  @IsString()
  password: string;
}

export class ChangePasswordDTO {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain: minimum 8 characters, a digit, an uppercase, a lowercase and a special characters!',
    },
  )
  newPassword: string;

  @ApiProperty()
  @IsString()
  confirmedNewPassword: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'Birthdate of the user',
    example: '1990-01-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsDate({ message: 'Birthdate must be a valid date' })
  @IsOptional()
  @Type(() => Date)
  birthdate?: Date;
}

// import {
//   IsDate,
//   IsEmail,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
// } from 'class-validator';

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   username: string;

//   @IsEmail()
//   @IsString()
//   @IsNotEmpty()
//   email: string;

//   @IsString()
//   @IsOptional()
//   avatar: string;

//   @IsDate()
//   @IsNotEmpty()
//   @IsOptional()
//   birthdate: Date;
// }

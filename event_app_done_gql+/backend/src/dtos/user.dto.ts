import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ObjectType, Field , InputType, Int } from '@nestjs/graphql';
import { UserEvent } from './models.dtos';

@InputType()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
@InputType()
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

@ObjectType()
export class UserResponse {

  @Field(() => UserEvent, { nullable: true })
  user?: UserEvent;
}

@InputType()
export class UpdateUsernameInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  username: string;
}

@InputType()
export class UpdateEmailInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  password: string;
}

@InputType()
export abstract class DeleteUserDto {

  @Field()
  userId: number;
}




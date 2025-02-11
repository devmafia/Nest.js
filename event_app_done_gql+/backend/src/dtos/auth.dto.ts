import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  message: string;

  @Field()
  token: string;

  @Field(() => Int, { nullable: true })
  userId?: number;
}

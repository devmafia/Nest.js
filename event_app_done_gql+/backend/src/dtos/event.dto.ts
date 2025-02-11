import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventDto {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field()
  category: string;

  @Field()
  price: string;

  @Field()
  place: string;

  @Field(() => Int)
  availableSeats: number;

  @Field()
  image?: string;
}

@InputType()
export class UpdateEventDto {

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  price?: string;

  @Field({ nullable: true })
  place?: string;

  @Field(() => Int, { nullable: true })
  availableSeats?: number;

  @Field()
  image?: string;
}

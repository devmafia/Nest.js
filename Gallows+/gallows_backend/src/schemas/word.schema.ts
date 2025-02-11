// src/words/schemas/word.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WordDocument = Word & Document;

@Schema()
export class Word {
  _id: Types.ObjectId;
  @Prop({ required: true })
  text: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);

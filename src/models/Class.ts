import {
  prop, getModelForClass, modelOptions, Ref,
} from '@typegoose/typegoose';
import { Course } from './Course';

@modelOptions({ schemaOptions: { collection: 'classes' } })
export class Class {
  @prop({ required: true, unique: true })
  public code !: string;

  @prop({ required: true })
  public semester!: number;

  @prop({ required: true, ref: 'Course' })
  public courses!: Ref<Course>[];
}

const ClassModel = getModelForClass(Class);

export default ClassModel;

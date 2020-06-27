import {
  prop, getModelForClass, modelOptions, Ref,
} from '@typegoose/typegoose';
import { Period } from './Period';
import { Teacher } from './Teacher';

@modelOptions({ schemaOptions: { collection: 'courses' } })
export class Course {
  @prop({ required: true, unique: true })
  public code!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public workload!: number;

  @prop({ ref: 'Teacher' })
  public teacherId?: Ref<Teacher>;

  @prop({ ref: 'Period' })
  public periodsId?: Ref<Period>[];
}

const CourseModel = getModelForClass(Course);

export default CourseModel;

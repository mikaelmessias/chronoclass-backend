import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { Weekday } from '../utils/enums';

@modelOptions({ schemaOptions: { collection: 'teachers' } })
export class Teacher {
  @prop({ required: true })
  public name!: string;

  public area?: string;

  @prop({ required: true })
  public workingDays!: Weekday[];
}

const TeacherModel = getModelForClass(Teacher);

export default TeacherModel;

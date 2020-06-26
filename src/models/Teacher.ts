import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { Weekday } from '../utils/enums';

@modelOptions({ schemaOptions: { collection: 'teachers' } })
export class Teacher {
  @prop({ required: true })
  public name!: string;

  @prop()
  public area?: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, type: String })
  public availableDays!: Weekday[];
}

const TeacherModel = getModelForClass(Teacher);

export default TeacherModel;

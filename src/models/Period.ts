import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { PeriodCode, Weekday } from '../utils/enums';

@modelOptions({ schemaOptions: { collection: 'periods' } })
export class Period {
  @prop({ required: true, enum: Weekday, type: String })
  public weekday!: Weekday;

  @prop({ required: true, enum: PeriodCode, type: String })
  public code!: PeriodCode;

  @prop({ required: true, unique: true })
  public weekdayPeriod!: string;

  @prop({ required: true })
  public startHour!: string;

  @prop({ required: true })
  public endHour!: string;
}

const PeriodModel = getModelForClass(Period);

export default PeriodModel;

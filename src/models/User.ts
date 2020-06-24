import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'users' } })
class User {
  @prop({ required: true })
  public name!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;

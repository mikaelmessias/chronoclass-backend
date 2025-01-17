import { Request, Response } from 'express';
import UserSchema from '../models/User';

class UserController {
  async index(_request: Request, response: Response): Promise<Response<any>> {
    try {
      const users = await UserSchema.find();

      if (!users.length) {
        return response.status(404).json({
          error: 'Found 0 documents',
        });
      }

      return response.json(users);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async show(request: Request, response: Response): Promise<Response<any>> {
    try {
      const { userId } = request.params;

      const user = await UserSchema.findById(userId);

      if (!user) {
        return response.status(404).json({
          error: 'Document not found for given ID.',
        });
      }

      return response.json(user);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async store(request: Request, response: Response): Promise<Response<any>> {
    try {
      const userData = request.body;

      const user = await UserSchema.create(userData);

      return response.json(user);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default UserController;

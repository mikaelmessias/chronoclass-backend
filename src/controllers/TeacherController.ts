import { Request, Response } from 'express';
import TeacherSchema, { Teacher } from '../models/Teacher';
import { Weekday } from '../utils/enums';

interface TeacherBodyParams {
  name: string;
  email: string;
  area?: string;
  availableDays: string | Weekday[];
}

class TeacherController {
  async store(request: Request, response: Response): Promise<Response<any>> {
    const {
      name, email, area, availableDays,
    }: TeacherBodyParams = request.body;

    let serializedAvailableDays: Weekday[];

    if (typeof availableDays === 'string') {
      serializedAvailableDays = availableDays
        .split(',')
        .map((day) => Weekday[day.trim().toUpperCase() as keyof typeof Weekday]);
    } else {
      serializedAvailableDays = availableDays;
    }

    try {
      const teacher = await TeacherSchema.create({
        name,
        email,
        area,
        availableDays: serializedAvailableDays,
      });

      return response.json(teacher);
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        return response.json({
          error: 'Duplicate key: email is already being used',
        });
      }

      return response.json(error);
    }
  }
}

export default TeacherController;

import { Request, Response } from 'express';
import TeacherSchema from '../models/Teacher';
import { Weekday } from '../utils/enums';

interface TeacherBodyParams {
  name: string;
  email: string;
  area?: string;
  availableDays: string | Weekday[];
}

interface TeacherQueryParams {
  availableDays?: string;
}

interface TeacherQueryFilters {
  availableDays?: {
    $in: Weekday[],
  };
}

class TeacherController {
  async index(request: Request, response: Response): Promise<Response<any>> {
    try {
      const { availableDays }: TeacherQueryParams = request.query;

      const filters: TeacherQueryFilters = {};

      if (availableDays) {
        const serializedWeekdays: Weekday[] = availableDays
          .split(',')
          .map((day) => {
            const serializedDay = day.trim().toUpperCase();

            return Weekday[serializedDay as keyof typeof Weekday];
          });

        filters.availableDays = {
          $in: serializedWeekdays,
        };
      }

      const teachers = await TeacherSchema.find(filters);

      if (!teachers.length) {
        return response.status(404).json({
          error: 'Found 0 documents',
        });
      }

      return response.json(teachers);
    } catch (error) {
      return response.json(error);
    }
  }

  async show(request: Request, response: Response): Promise<Response<any>> {
    try {
      const { teacherId } = request.params;

      const teacher = await TeacherSchema.findById(teacherId);

      if (!teacher) {
        return response.status(404).json({
          error: 'Document not found for given ID.',
        });
      }

      return response.json(teacher);
    } catch (error) {
      return response.json(error);
    }
  }

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

import { Request, Response } from 'express';
import CourseSchema from '../models/Course';
import TeacherSchema from '../models/Teacher';
import { Weekday } from '../utils/enums';

interface TeacherBodyParams {
  name: string;
  email: string;
  area?: string;
  availableDays: string;
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
      return response.status(400).json(error);
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

      const courses = await CourseSchema
        .find({ teacherId })
        .populate('periodsId', 'weekday, weekdayPeriod')
        .exec();

      return response.json({
        teacher,
        courses,
      });
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async store(request: Request, response: Response): Promise<Response<any>> {
    const teacherData: TeacherBodyParams[] = request.body;

    try {
      const serializedTeacherData = teacherData.map((teacher) => {
        if (!teacher.availableDays) {
          throw new TypeError('availableDays is undefined');
        }

        const serializedAvailableDays: Weekday[] = teacher.availableDays
          .split(',')
          .map((day) => Weekday[
              day.trim().toUpperCase() as keyof typeof Weekday
          ]);

        return {
          ...teacher,
          availableDays: serializedAvailableDays,
        };
      });

      const teachers = await TeacherSchema.create(serializedTeacherData);

      return response.json(teachers);
    } catch (error) {
      return response.status(400).json({
        error: {
          name: error.name,
          message: error.code === 11000 ? 'Duplicate key' : error.message,
          key: error.code === 11000 ? error.keyValue : null,
          collection: error.code === 11000 ? 'chronoclass.teachers' : null,
        },
      });
    }
  }
}

export default TeacherController;

import { Ref } from '@typegoose/typegoose';
import { Request, Response } from 'express';
import ClassSchema from '../models/Class';
import CourseSchema, { Course } from '../models/Course';

interface ClassCreateBody {
  code: string;
  semester: number;
  courses: string[];
}
class ClassController {
  async index(request: Request, response: Response): Promise<Response<any>> {
    try {
      const classes = await ClassSchema.find();

      if (!classes) {
        return response.status(404).json({
          error: 'Found 0 documents',
        });
      }

      return response.json(classes);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async show(request: Request, response: Response): Promise<Response<any>> {
    const { classCode } = request.params;

    try {
      const classDoc = await ClassSchema.findOne({ code: classCode })
        .populate({
          path: 'courses',
          select: '-__v',
          populate: {
            path: 'periodsId',
            select: 'weekdayPeriod -_id',
          },
        })
        .exec();

      if (!classDoc) {
        return response.status(404).json({
          error: 'Document not found for give code',
        });
      }

      return response.json(classDoc);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async store(request: Request, response: Response): Promise<Response<any>> {
    const classData: ClassCreateBody[] = request.body;

    try {
      const serializePromise = classData.map(async (data) => {
        const coursesDoc = await CourseSchema.find({ code: { $in: data.courses } });

        const courses: Ref<Course>[] = [];

        coursesDoc.forEach(async (course) => (
        // eslint-disable-next-line no-underscore-dangle
          courses.push(course._id)
        ));

        return ({
          ...data,
          courses,
        });
      });

      const serializedClassData = await Promise
        .all(serializePromise)
        .then(
          async (data) => data,
        );

      const classes = await ClassSchema.create(serializedClassData);

      return response.json(classes);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default ClassController;

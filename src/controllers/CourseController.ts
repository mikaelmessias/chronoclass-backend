import { Ref } from '@typegoose/typegoose';
import { Request, Response } from 'express';
import CourseSchema from '../models/Course';
import { Period } from '../models/Period';
import { Teacher } from '../models/Teacher';
// import TeacherSchema, { Teacher } from '../models/Teacher';

interface CourseCreateBody {
  code: string,
  name: string,
  workload: number
}

interface CourseUpdateBody {
  code?: string,
  name?: string,
  workload?: number,
  teacherId?: Ref<Teacher>,
  periodsId?: Ref<Period>[]
}

class CourseController {
  async index(request: Request, response: Response): Promise<Response<any>> {
    try {
      const courses = await CourseSchema.find();

      if (!courses) {
        return response.status(404).json({
          error: 'Found 0 documents.',
        });
      }

      return response.json(courses);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async show(request: Request, response: Response): Promise<Response<any>> {
    try {
      const { courseId } = request.params;

      const course = await CourseSchema.findById(courseId);

      if (!course) {
        return response.status(404).json({
          error: 'Document not found for given id.',
        });
      }

      return response.json(course);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async update(request: Request, response: Response): Promise<Response<any>> {
    const { courseId } = request.params;
    const courseData: CourseUpdateBody = request.body;

    try {
      const course = await CourseSchema.findOneAndUpdate(
        { _id: courseId }, courseData, { new: true },
      );

      if (!course) {
        return response.status(400).json({
          error: 'Document not found for given ID.',
        });
      }

      return response.json(course);
    } catch (error) {
      // console.log(error);
      return response.status(400).json(error);
    }
  }

  async store(request: Request, response: Response): Promise<Response<any>> {
    const courseData: CourseCreateBody = request.body;

    try {
      const course = await CourseSchema.create(courseData);

      console.log(course);

      return response.json(course);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default CourseController;

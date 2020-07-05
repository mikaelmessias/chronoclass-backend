/* eslint-disable no-underscore-dangle */
import { Ref } from '@typegoose/typegoose';
import { Request, Response } from 'express';
import ClassSchema from '../models/Class';
import CourseSchema, { Course } from '../models/Course';
import PeriodSchema, { Period } from '../models/Period';
import TeacherSchema, { Teacher } from '../models/Teacher';
import findConflict from '../utils/courses';
import { Weekday } from '../utils/enums';

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

interface CourseUpdateParams {
  params: {
    courseId: Ref<Course>,
  }
}
type UpdateRequest = Request & CourseUpdateParams;

interface UpdatePeriod {
  weekday: Weekday,
  weekdayPeriod: string
};

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

  async update(request: UpdateRequest, response: Response): Promise<Response<any>> {
    const { courseId } = request.params;
    const courseData: CourseUpdateBody = request.body;

    try {
      const { periodsId, teacherId } = courseData;
      let courseWeekdays: UpdatePeriod[] = [];

      if (periodsId) {
        courseWeekdays = await PeriodSchema.find({
          _id: { $in: periodsId },
        }, (_, periods) => {
          if (periods?.length !== periodsId.length) {
            return response.status(404).json({
              error: 'Document not found for one or more given ids',
            });
          };

          return true;
        }).map((array) => (
          array.map((object) => ({
            weekday: object.weekday,
            weekdayPeriod: object.weekdayPeriod,
          }))
        ));

        const classDoc = await ClassSchema
          .find({ courses: courseId })
          .populate({
            path: 'courses',
            select: 'code',
            ref: 'Course',
            populate: {
              path: 'periodsId',
              select: 'weekdayPeriod -_id',
              ref: 'Period',
            },
          })
          .exec();

        if (classDoc.length > 0) {
          findConflict.class(courseId, classDoc, courseWeekdays);
        }
      }

      if (teacherId) {
        const teacher = await TeacherSchema.findById(teacherId);

        if (!teacher) {
          return response.status(404).json({
            error: 'Document not found for given teacher id',
            teacherId,
          });
        }

        if (courseWeekdays.length > 0) {
          let unavailableDays: Weekday[] = [];

          courseWeekdays.forEach((day) => {
            if (!teacher.availableDays.includes(day.weekday)) {
              unavailableDays.push(day.weekday);
            }
          });

          unavailableDays = unavailableDays.filter(
            (day, id) => unavailableDays.indexOf(day) === id,
          );

          if (unavailableDays.length > 0) {
            return response.status(400).json({
              error: 'Teacher not available for one or more weekdays',
              weekdays: unavailableDays,
            });
          }
        }

        const courses = await CourseSchema
          .find({ teacherId })
          .populate({
            path: 'periodsId',
            select: 'weekdayPeriod -_id',
            ref: 'Period',
          })
          .exec();

        if (courses.length > 0) {
          findConflict.teacher(courseId, courses, courseWeekdays);
        }
      }

      const course = await CourseSchema.findOneAndUpdate(
        { _id: courseId }, courseData, { new: true },
      )
        .populate('periodsId', 'weekdayPeriod weekday')
        .exec();

      if (!course) {
        return response.status(404).json({
          error: 'Document not found for given ID.',
        });
      }

      return response.json(course);
    } catch (error) {
      return response.status(400).json({
        error: {
          name: error.name,
          message: error.message,
        },
      });
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

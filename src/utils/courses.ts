/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DocumentType } from '@typegoose/typegoose';
import { Class } from '../models/Class';
import { Course } from '../models/Course';
import { Period } from '../models/Period';
import { Weekday } from './enums';

interface UpdatePeriod {
  weekday: Weekday,
  weekdayPeriod: string
};

const classCourseConflict = (
  courseId: any,
  classDoc: DocumentType<Class>[],
  courseWeekdays: UpdatePeriod[],
): void => {
  classDoc.forEach((array) => {
    const courses = array.courses as DocumentType<Course>[];

    courses.forEach((course) => {
      if (!String(courseId).match(course._id)) {
        const periods = course.periodsId as DocumentType<Period>[];

        periods.forEach((period) => {
          courseWeekdays.forEach((day) => {
            if (period.weekdayPeriod.includes(day.weekdayPeriod)) {
              throw new Error(`The ${period.weekdayPeriod} is being used for `
              + 'another course of this class');
            }
          });
        });
      }
    });
  });
};

const teacherCoursesConflicts = (
  courseId: any,
  courses: DocumentType<Course>[],
  courseWeekdays: UpdatePeriod[],
): void => {
  courses.forEach((course) => {
    if (!String(courseId).match(course._id)) {
      const periods = course.periodsId as DocumentType<Period>[];

      periods.forEach((period) => {
        courseWeekdays.forEach((day) => {
          if (period.weekdayPeriod.includes(day.weekdayPeriod)) {
            throw new Error(`The ${period.weekdayPeriod} is being used in `
              + 'another course of this teacher');
          }
        });
      });
    }
  });
};

const findConflict = {
  class: classCourseConflict,
  teacher: teacherCoursesConflicts,
};

export default findConflict;

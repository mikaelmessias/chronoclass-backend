import { Request, Response } from 'express';
import ClassSchema, { Class } from '../models/Class';

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
          select: '-__v -workload',
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
    const classData: Class = request.body;

    try {
      const classDoc = await ClassSchema.create(classData);

      console.log(classDoc);

      return response.json(classDoc);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default ClassController;

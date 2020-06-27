import { Request, Response } from 'express';
import PeriodSchema, { Period } from '../models/Period';
import { PeriodCode, Weekday } from '../utils/enums';

interface PeriodQueryFilters {
  weekday?: Weekday;
  code?: PeriodCode;
}

class PeriodController {
  async index(request: Request, response: Response): Promise<Response<any>> {
    try {
      const { weekday, code } = request.query;

      const filters: PeriodQueryFilters = {};

      if (weekday) {
        const upperWeekday = weekday?.toString().toUpperCase();

        filters.weekday = Weekday[upperWeekday as keyof typeof Weekday];
      }

      if (code) {
        const upperCode = code?.toString().toUpperCase();

        filters.code = PeriodCode[upperCode as keyof typeof PeriodCode];
      }

      const periods = await PeriodSchema.find(filters);

      if (!periods.length) {
        return response.status(404).json({
          error: 'Found 0 items',
        });
      }

      return response.json(periods);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async populate(_: Request, response: Response): Promise<Response<any>> {
    const periodCodes = Object.values(PeriodCode);
    const weekdays = Object.values(Weekday);
    const periods: Period[] = [];

    weekdays.forEach((weekday) => {
      let weekdayCode!: string;

      switch (weekday) {
        case Weekday.MONDAY:
          weekdayCode = '2';
          break;
        case Weekday.TUESDAY:
          weekdayCode = '3';
          break;
        case Weekday.WEDNESDAY:
          weekdayCode = '4';
          break;
        case Weekday.THURSDAY:
          weekdayCode = '5';
          break;
        case Weekday.FRIDAY:
          weekdayCode = '6';
          break;
        case Weekday.SATURDAY:
          weekdayCode = '7';
          break;
        default:
          break;
      }

      periodCodes.forEach((code) => {
        let startHour!: string;
        let endHour!: string;

        switch (code) {
          case PeriodCode.M1:
            startHour = '07:30';
            endHour = '08:20';
            break;
          case PeriodCode.M2:
            startHour = '08:20';
            endHour = '09:10';
            break;
          case PeriodCode.M3:
            startHour = '09:10';
            endHour = '10:00';
            break;
          case PeriodCode.M4:
            startHour = '10:20';
            endHour = '11:10';
            break;
          case PeriodCode.M5:
            startHour = '11:10';
            endHour = '12:00';
            break;
          case PeriodCode.M6:
            startHour = '12:00';
            endHour = '12:50';
            break;
          case PeriodCode.T1:
            startHour = '13:00';
            endHour = '13:50';
            break;
          case PeriodCode.T2:
            startHour = '13:50';
            endHour = '14:40';
            break;
          case PeriodCode.T3:
            startHour = '14:40';
            endHour = '15:30';
            break;
          case PeriodCode.T4:
            startHour = '15:50';
            endHour = '16:40';
            break;
          case PeriodCode.T5:
            startHour = '16:40';
            endHour = '17:30';
            break;
          case PeriodCode.T6:
            startHour = '17:30';
            endHour = '18:20';
            break;
          case PeriodCode.N1:
            startHour = '19:00';
            endHour = '19:45';
            break;
          case PeriodCode.N2:
            startHour = '19:45';
            endHour = '20:30';
            break;
          case PeriodCode.N3:
            startHour = '20:30';
            endHour = '21:15';
            break;
          case PeriodCode.N4:
            startHour = '21:25';
            endHour = '22:10';
            break;
          case PeriodCode.N5:
            startHour = '22:10';
            endHour = '22:55';
            break;
          default:
            break;
        }

        periods.push({
          weekdayPeriod: weekdayCode + code,
          weekday,
          code,
          startHour,
          endHour,
        });
      });
    });

    try {
      const objects = await PeriodSchema.create(periods);

      return response.json(objects);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default PeriodController;

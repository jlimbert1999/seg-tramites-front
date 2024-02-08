import moment from 'moment';

export class TimeManager {
  static formatDate(date: Date | string, format = 'MM/D/YYYY HH:mm'): string {
    return moment(date).format(format);
  }
}

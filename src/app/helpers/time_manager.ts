import moment from 'moment';

export class TimeManager {
  static formatDate(date: Date | string, format = 'MM/D/YYYY HH:mm'): string {
    return moment(date).format(format);
  }

  static duration(initDate: string | Date, endDate: string | Date): string {
    const start = moment(initDate);
    const end = moment(endDate);
    const duration = moment.duration(end.diff(start));
    const parts: string[] = [];
    if (duration.years() >= 1) {
      const years = Math.floor(duration.years());
      parts.push(years + ' ' + (years > 1 ? 'años' : 'año'));
    }
    if (duration.months() >= 1) {
      const months = Math.floor(duration.months());
      parts.push(months + ' ' + (months > 1 ? 'meses' : 'mes'));
    }
    if (duration.days() >= 1) {
      const days = Math.floor(duration.days());
      parts.push(days + ' ' + (days > 1 ? 'dias' : 'dia'));
    }
    if (duration.hours() >= 1) {
      const hours = Math.floor(duration.hours());
      parts.push(hours + ' ' + (hours > 1 ? 'horas' : 'hora'));
    }
    if (duration.minutes() >= 1) {
      const minutes = Math.floor(duration.minutes());
      parts.push(minutes + ' ' + (minutes > 1 ? 'minutos' : 'minuto'));
    }
    if (duration.seconds() >= 1) {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + ' ' + (seconds > 1 ? 'segundos' : 'segundo'));
    }
    return parts.join(', ');
  }
}

import { format } from 'date-fns';

export function formatDate(value: string, formatStr: string = 'yyyy-MM-dd') {
  return format(new Date(value), formatStr);
}

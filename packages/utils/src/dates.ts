import { Day, Month } from "./constants";

export function now() {
  return new Date();
}

export function oneYearAgo() {
  const date = now();
  date.setDate(date.getDate() - 365);
  return date;
}

export function thirtyDaysFromNow() {
  const date = now();
  date.setDate(date.getDate() + 30);
  return date;
}

export function sixtyDaysFromNow() {
  const date = now();
  date.setDate(date.getDate() + 60);
  return date;
}

export function ninetyDaysFromNow() {
  const date = now();
  date.setDate(date.getDate() + 90);
  return date;
}

export function isBefore(date1: Date, date2: Date) {
  return date1.getTime() < date2.getTime();
}

export function isAfter(date1: Date, date2: Date) {
  return date1.getTime() > date2.getTime();
}

export function dayIndexToName(index: number): Day {
  switch (index) {
    case 0:
      return Day.Sunday;
    case 1:
      return Day.Monday;
    case 2:
      return Day.Tuesday;
    case 3:
      return Day.Wednesday;
    case 4:
      return Day.Thursday;
    case 5:
      return Day.Friday;
    case 6:
      return Day.Saturday;
  }
}

export function monthIndexToName(index: number): Month {
  switch (index) {
    case 0:
      return Month.January;
    case 1:
      return Month.February;
    case 2:
      return Month.March;
    case 3:
      return Month.April;
    case 4:
      return Month.May;
    case 5:
      return Month.June;
    case 6:
      return Month.July;
    case 7:
      return Month.August;
    case 8:
      return Month.September;
    case 9:
      return Month.October;
    case 10:
      return Month.November;
    case 11:
      return Month.December;
  }
}

export function monthName(date: Date): Month {
  return monthIndexToName(date.getMonth());
}

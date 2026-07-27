const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const TRIVIA_TIME_ZONE = "Asia/Manila";

type DateOnlyParts = {
  day: number;
  month: number;
  year: number;
};

const formatDateOnlyParts = ({ day, month, year }: DateOnlyParts) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const getDateOnlyParts = (dateValue: string): DateOnlyParts | null => {
  const dateParts = DATE_ONLY_PATTERN.exec(dateValue);

  if (!dateParts) return null;

  const year = Number(dateParts[1]);
  const month = Number(dateParts[2]);
  const day = Number(dateParts[3]);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
};

export const getLocalDateValue = (date = new Date()) => {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: TRIVIA_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);
  const datePartValues = Object.fromEntries(
    dateParts.map((datePart) => [datePart.type, datePart.value]),
  );

  return `${datePartValues.year}-${datePartValues.month}-${datePartValues.day}`;
};

export const parseDateOnly = (dateValue: string) => {
  const dateParts = getDateOnlyParts(dateValue);

  if (!dateParts) return new Date(Number.NaN);

  return new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day));
};

export const formatTriviaDate = (dateValue: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(parseDateOnly(dateValue));

export const getTriviaMonthKey = (dateValue: string) => {
  const dateParts = getDateOnlyParts(dateValue);

  if (!dateParts) return "";

  return `${dateParts.year}-${String(dateParts.month).padStart(2, "0")}`;
};

export const getTriviaMonthLabel = (dateValue: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
  }).format(
    parseDateOnly(dateValue),
  );

export const isTriviaToday = (dateValue: string) =>
  dateValue === getLocalDateValue();

export const getCurrentTriviaMonthRange = (date = new Date()) => {
  const todayDate = getLocalDateValue(date);
  const todayParts = getDateOnlyParts(todayDate);

  if (!todayParts) {
    throw new Error("Unable to determine the current trivia date");
  }

  const finalDayOfMonth = new Date(
    Date.UTC(todayParts.year, todayParts.month, 0),
  ).getUTCDate();
  const nextMonthStart = new Date(
    Date.UTC(todayParts.year, todayParts.month, 1),
  );

  return {
    monthEndDate: formatDateOnlyParts({
      ...todayParts,
      day: finalDayOfMonth,
    }),
    nextMonthStartDate: formatDateOnlyParts({
      day: nextMonthStart.getUTCDate(),
      month: nextMonthStart.getUTCMonth() + 1,
      year: nextMonthStart.getUTCFullYear(),
    }),
    todayDate,
  };
};

export const getRemainingTriviaMonthDates = (date = new Date()) => {
  const { nextMonthStartDate, todayDate } =
    getCurrentTriviaMonthRange(date);
  const startDate = parseDateOnly(todayDate);
  const endDate = parseDateOnly(nextMonthStartDate);
  const numberOfDates =
    Math.floor((endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY) +
    1;

  return Array.from({ length: numberOfDates }, (_, dateOffset) => {
    const calendarDate = new Date(
      startDate.getTime() + dateOffset * MILLISECONDS_PER_DAY,
    );

    return formatDateOnlyParts({
      day: calendarDate.getUTCDate(),
      month: calendarDate.getUTCMonth() + 1,
      year: calendarDate.getUTCFullYear(),
    });
  });
};

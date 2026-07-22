const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const getLocalDateValue = (date = new Date()) => {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Manila",
    year: "numeric",
  }).formatToParts(date);
  const datePartValues = Object.fromEntries(
    dateParts.map((datePart) => [datePart.type, datePart.value]),
  );

  return `${datePartValues.year}-${datePartValues.month}-${datePartValues.day}`;
};

export const parseDateOnly = (dateValue: string) => {
  const dateParts = DATE_ONLY_PATTERN.exec(dateValue);

  if (!dateParts) return new Date(dateValue);

  const [, year, month, day] = dateParts;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const formatTriviaDate = (dateValue: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDateOnly(dateValue));

export const getTriviaMonthKey = (dateValue: string) => {
  const date = parseDateOnly(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const getTriviaMonthLabel = (dateValue: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    parseDateOnly(dateValue),
  );

export const isTriviaToday = (dateValue: string) =>
  dateValue === getLocalDateValue();

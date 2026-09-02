const MANILA_TIME_ZONE = "Asia/Manila";

export const getManilaDateValue = (date = new Date()) => {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: MANILA_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);
  const datePartValues = Object.fromEntries(
    dateParts.map((datePart) => [datePart.type, datePart.value]),
  );

  return `${datePartValues.year}-${datePartValues.month}-${datePartValues.day}`;
};

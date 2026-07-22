export type ValidatedTrivia = {
  content: string;
  publishDate: string;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const getManilaCurrentDate = () => {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Manila",
    year: "numeric",
  }).formatToParts(new Date());
  const partValues = Object.fromEntries(
    dateParts.map((datePart) => [datePart.type, datePart.value]),
  );

  return `${partValues.year}-${partValues.month}-${partValues.day}`;
};

const isValidCalendarDate = (publishDate: string) => {
  const match = DATE_PATTERN.exec(publishDate);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

export const validateTrivia = (
  contentValue: string,
  publishDateValue: string,
): ValidatedTrivia => {
  const content = contentValue.trim();
  const publishDate = publishDateValue.trim();

  if (content.length < 1 || content.length > 1000) {
    throw new Error("Trivia content must contain between 1 and 1000 characters");
  }

  if (!isValidCalendarDate(publishDate)) {
    throw new Error("A valid publish date is required");
  }

  return { content, publishDate };
};

export const assertPublishDateIsNotPast = (publishDate: string) => {
  if (publishDate < getManilaCurrentDate()) {
    throw new Error("Publish date cannot be in the past");
  }
};

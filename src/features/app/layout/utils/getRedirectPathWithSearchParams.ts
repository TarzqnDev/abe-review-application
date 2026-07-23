type PageSearchParams = Record<
  string,
  string | string[] | undefined
>;

export const getRedirectPathWithSearchParams = (
  pathname: string,
  searchParams: PageSearchParams,
) => {
  const redirectSearchParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((searchParamValue) => {
        redirectSearchParams.append(name, searchParamValue);
      });
    } else if (value !== undefined) {
      redirectSearchParams.set(name, value);
    }
  });

  const queryString = redirectSearchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};

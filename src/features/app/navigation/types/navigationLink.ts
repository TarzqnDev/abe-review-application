import type { StaticImageData } from "next/image";

export type NavigationLink = {
  href: string;
  icon: StaticImageData;
  iconAlt: string;
  label: string;
  matchPath: (pathname: string) => boolean;
};

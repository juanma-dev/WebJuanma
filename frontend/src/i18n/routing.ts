import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es';

export type Locale = (typeof locales)[number];

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });

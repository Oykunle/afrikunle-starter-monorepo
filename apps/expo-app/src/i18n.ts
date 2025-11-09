import en from './locales/en.json';
import fr from './locales/fr.json';

export type LocaleKey = 'en' | 'fr';
const locales: Record<LocaleKey, any> = { en, fr };

export function t(locale: LocaleKey, key: string): string {
  return (locales[locale] && locales[locale][key]) || key;
}

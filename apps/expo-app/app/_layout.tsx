import { Stack } from 'expo-router';
import { useState, createContext } from 'react';
import { LocaleKey } from '../src/i18n';

export const LocaleContext = createContext<{locale: LocaleKey, setLocale: (l: LocaleKey) => void}>({
  locale: 'en', setLocale: () => {}
});

export default function Layout() {
  const [locale, setLocale] = useState<LocaleKey>('en');
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <Stack screenOptions={{ headerShown: false }} />
    </LocaleContext.Provider>
  );
}

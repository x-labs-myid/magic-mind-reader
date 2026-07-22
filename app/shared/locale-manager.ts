import { ApplicationSettings, Application } from '@nativescript/core';
import { overrideLocale, androidLaunchEventLocalizationHandler, localize as nativeLocalize } from '@nativescript/localize';

import * as enJson from '../i18n/en.default.json';
import * as idJson from '../i18n/id.json';

const dictionaries: Record<string, Record<string, string>> = {
  en: enJson,
  id: idJson
};

export function getAppLocale(): string {
  return ApplicationSettings.getString('__app__language__', 'en');
}

export function setAppLocale(lang: string) {
  const languageCode = lang.substring(0, 2);
  ApplicationSettings.setString('__app__language__', languageCode);
  ApplicationSettings.setString('app_language', languageCode);
  ApplicationSettings.setBoolean('has_selected_language', true);

  try {
    overrideLocale(languageCode);
  } catch (e) {}

  if (Application.android) {
    try {
      androidLaunchEventLocalizationHandler();
    } catch (e) {}
  }
}

export function localize(key: string, ...args: any[]): string {
  const lang = getAppLocale();
  const dict = dictionaries[lang] || dictionaries['en'];
  let str = dict[key] || (dictionaries['en'] ? dictionaries['en'][key] : null);

  if (!str) {
    try {
      str = nativeLocalize(key, ...args);
    } catch (e) {
      str = key;
    }
  }

  if (typeof str !== 'string') {
    str = String(str);
  }

  if (args && args.length > 0) {
    args.forEach((arg) => {
      str = str.replace('%s', String(arg)).replace('%d', String(arg));
    });
  }

  return str;
}

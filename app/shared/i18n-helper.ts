import { ApplicationSettings } from '@nativescript/core';
import { overrideLocale } from '@nativescript/localize';

import * as enJson from '../i18n/en.default.json';
import * as idJson from '../i18n/id.json';

const dictionaries: Record<string, Record<string, string>> = {
  en: enJson,
  id: idJson
};

export class I18nHelper {
  public static getLanguage(): string {
    return ApplicationSettings.getString('app_language', 'en');
  }

  public static setLanguage(lang: string) {
    ApplicationSettings.setString('app_language', lang);
    ApplicationSettings.setBoolean('has_selected_language', true);
    try {
      overrideLocale(lang);
    } catch (e) {}
  }

  public static getString(key: string, ...args: any[]): string {
    const lang = this.getLanguage();
    const dict = dictionaries[lang] || dictionaries['en'];
    let str = dict[key] || dictionaries['en'][key] || key;

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
}

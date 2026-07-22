import { EventData, Page, Frame, Observable } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';
import { setAppLocale } from '../shared/locale-manager';

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new Observable();
}

function setLanguageAndProceed(lang: string) {
  AudioHelper.playTap();
  setAppLocale(lang);

  Frame.topmost().navigate({
    moduleName: 'main-page',
    clearHistory: true,
    transition: {
      name: 'slide',
      duration: 300,
      curve: 'easeInOut'
    }
  });
}

export function selectEnglish() {
  setLanguageAndProceed('en');
}

export function selectIndonesian() {
  setLanguageAndProceed('id');
}

import { EventData, Page, Frame } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';

export function onNavigatingTo(args: EventData) {
  // Page initialization logic if needed
}

export function goBack() {
  AudioHelper.playTap();
  Frame.topmost().navigate({
    moduleName: 'main-page',
    animated: true,
    transition: {
      name: 'slideBottom',
      duration: 300,
      curve: 'easeInOut'
    }
  });
}

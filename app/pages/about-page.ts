import { EventData, Page, Frame, Observable } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  const viewModel = new Observable();
  page.bindingContext = viewModel;
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

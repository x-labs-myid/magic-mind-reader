import { EventData, Page, Frame } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';

// Import dev-preview-page statically to ensure Webpack bundles it
import * as devPreviewPageModule from './dev-preview-page';

export function onNavigatingTo(args: EventData) {
  // Page initialization logic if needed
}

export function goDevPreview() {
  AudioHelper.playTap();
  Frame.topmost().navigate({
    moduleName: 'pages/dev-preview-page',
    animated: true,
    transition: {
      name: 'slide',
      duration: 300,
      curve: 'easeInOut'
    }
  });
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

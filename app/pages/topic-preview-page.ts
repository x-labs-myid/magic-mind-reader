import { EventData, Page, Frame, Observable, View } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';
import { TopicService } from '../shared/topic-service';
import { getAppLocale } from '../shared/locale-manager';

// Import target pages statically to ensure Webpack bundles them
import * as gamePageModule from './game-page';

const tileColors = [
  { bg: '#00e5ff', fg: '#000000' },
  { bg: '#ffee00', fg: '#000000' },
  { bg: '#ff4081', fg: '#ffffff' },
  { bg: '#2ecc71', fg: '#000000' },
  { bg: '#ff9800', fg: '#000000' },
  { bg: '#8b5cf6', fg: '#ffffff' },
  { bg: '#ffee00', fg: '#000000' },
  { bg: '#00e5ff', fg: '#000000' },
  { bg: '#2ecc71', fg: '#000000' },
  { bg: '#ff4081', fg: '#ffffff' },
  { bg: '#ff9800', fg: '#000000' },
  { bg: '#8b5cf6', fg: '#ffffff' }
];

function getRandom12Values(): number[] {
  const all31 = Array.from({ length: 31 }, (_, i) => i + 1);
  for (let i = all31.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all31[i], all31[j]] = [all31[j], all31[i]];
  }
  return all31.slice(0, 12);
}

let viewModel: Observable;
let currentTopicId: string = 'animals';
let currentPage: Page | null = null;

export function onNavigatingTo(args: EventData) {
  currentPage = <Page>args.object;
  const navContext = currentPage.navigationContext || {};
  currentTopicId = navContext.topicId || TopicService.getSelectedTopicId();
  TopicService.setSelectedTopicId(currentTopicId);

  const lang = getAppLocale();
  viewModel = new Observable();

  // Randomize 12 values from 1..31 on every preview load
  const randomValues = getRandom12Values();

  for (let i = 0; i < 12; i++) {
    const val = randomValues[i];
    const item = TopicService.getItemByValue(currentTopicId, val, lang);
    const color = tileColors[i % tileColors.length];

    viewModel.set(`icon${i}`, item.icon);
    viewModel.set(`label${i}`, item.name);
    viewModel.set(`fontClass${i}`, item.fontClass || 'fas');
    viewModel.set(`bg${i}`, color.bg);
    viewModel.set(`fg${i}`, color.fg);
  }

  currentPage.bindingContext = viewModel;
}

export function onNavigatedTo(args: EventData) {
  if (!currentPage) return;

  // Staggered card shuffle entrance animation
  for (let i = 0; i < 12; i++) {
    const tileView = currentPage.getViewById<View>(`tile${i}`);
    if (tileView) {
      tileView.opacity = 0;
      tileView.scaleX = 0.4;
      tileView.scaleY = 0.4;
      tileView.translateY = 30;

      setTimeout(() => {
        AudioHelper.playTap();
        tileView.animate({
          opacity: 1,
          scale: { x: 1, y: 1 },
          translate: { x: 0, y: 0 },
          duration: 260,
          curve: 'easeOut'
        });
      }, i * 45);
    }
  }
}

export function goBack() {
  AudioHelper.playTap();
  Frame.topmost().navigate({
    moduleName: 'pages/select-topic-page',
    clearHistory: true,
    animated: true,
    transition: {
      name: 'slideRight',
      duration: 300
    }
  });
}

export function startGame() {
  AudioHelper.playTap();
  Frame.topmost().navigate({
    moduleName: 'pages/game-page',
    context: { topicId: currentTopicId },
    animated: true,
    transition: {
      name: 'slide',
      duration: 300,
      curve: 'easeInOut'
    }
  });
}

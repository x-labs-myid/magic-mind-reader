import { EventData, Page, Frame, Observable, View } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';
import { TopicService } from '../shared/topic-service';
import { getAppLocale } from '../shared/locale-manager';

const keys = [1, 2, 4, 8, 16];
const tables = [
  [ 21, 23, 25, 27, 29, 31, 19, 1, 17, 15, 13, 11, 9, 7, 5, 3 ],
  [ 31, 30, 27, 26, 23, 22, 19, 18, 2, 3, 6, 7, 10, 11, 14, 15 ],
  [ 5, 6, 7, 12, 13, 14, 15, 20, 4, 21, 22, 23, 28, 29, 30, 31 ],
  [ 9, 10, 11, 12, 13, 31, 14, 15, 24, 25, 26, 30, 27, 28, 8, 29 ],
  [ 17, 18, 19, 20, 21, 22, 31, 30, 29, 28, 27, 16, 26, 25, 24, 23 ]
];

const colorPalettes = [
  [
    { bg: '#00e5ff', fg: '#000000' }, { bg: '#8b5cf6', fg: '#ffffff' }, { bg: '#ffee00', fg: '#000000' }, { bg: '#00e5ff', fg: '#000000' },
    { bg: '#8b5cf6', fg: '#ffffff' }, { bg: '#ffee00', fg: '#000000' }, { bg: '#00e5ff', fg: '#000000' }, { bg: '#8b5cf6', fg: '#ffffff' },
    { bg: '#ffee00', fg: '#000000' }, { bg: '#00e5ff', fg: '#000000' }, { bg: '#8b5cf6', fg: '#ffffff' }, { bg: '#ffee00', fg: '#000000' },
    { bg: '#00e5ff', fg: '#000000' }, { bg: '#8b5cf6', fg: '#ffffff' }, { bg: '#ffee00', fg: '#000000' }, { bg: '#00e5ff', fg: '#000000' }
  ],
  [
    { bg: '#2ecc71', fg: '#000000' }, { bg: '#8b5cf6', fg: '#ffffff' }, { bg: '#ff9800', fg: '#000000' }, { bg: '#ffee00', fg: '#000000' },
    { bg: '#ff4081', fg: '#ffffff' }, { bg: '#00e5ff', fg: '#000000' }, { bg: '#2ecc71', fg: '#000000' }, { bg: '#8b5cf6', fg: '#ffffff' },
    { bg: '#ff9800', fg: '#000000' }, { bg: '#ffee00', fg: '#000000' }, { bg: '#ff4081', fg: '#ffffff' }, { bg: '#00e5ff', fg: '#000000' },
    { bg: '#2ecc71', fg: '#000000' }, { bg: '#8b5cf6', fg: '#ffffff' }, { bg: '#ff9800', fg: '#000000' }, { bg: '#ffee00', fg: '#000000' }
  ]
];

let currentPage: Page | null = null;

class GameViewModel extends Observable {
  private ofTables: number[] = [0, 1, 2, 3, 4];
  private step = 1;
  private result = 0;
  private currentTableIdx = 0;
  public topicId: string = 'animals';
  private userAnswers: boolean[] = [];

  // Scan effect properties
  public scanY = 0;
  public isScanning = false;
  public scanColor = 'rgba(0, 229, 255, 0.9)';

  constructor(topicId: string) {
    super();
    this.topicId = topicId || TopicService.getSelectedTopicId();
    TopicService.setSelectedTopicId(this.topicId);

    const lang = getAppLocale();
    const topic = TopicService.getTopicById(this.topicId);
    const topicTitle = lang === 'id' ? topic.title.id : topic.title.en;
    this.set('topicTitle', topicTitle);

    this.setupNextStep();
  }

  private updateStepIndicators() {
    for (let i = 1; i <= 5; i++) {
      if (i < this.step) {
        const isYes = this.userAnswers[i - 1];
        if (isYes) {
          this.set(`step${i}Bg`, '#2ecc71');
          this.set(`step${i}Fg`, '#000000');
          this.set(`step${i}Text`, '✓');
        } else {
          this.set(`step${i}Bg`, '#ff4081');
          this.set(`step${i}Fg`, '#ffffff');
          this.set(`step${i}Text`, '✕');
        }
      } else if (i === this.step) {
        this.set(`step${i}Bg`, '#ffee00');
        this.set(`step${i}Fg`, '#000000');
        this.set(`step${i}Text`, String(i));
      } else {
        this.set(`step${i}Bg`, '#ffffff');
        this.set(`step${i}Fg`, '#000000');
        this.set(`step${i}Text`, String(i));
      }
    }
  }

  public setupNextStep() {
    const randIdx = Math.floor(Math.random() * this.ofTables.length);
    this.currentTableIdx = this.ofTables[randIdx];
    this.ofTables.splice(randIdx, 1);

    const rawNumbers = tables[this.currentTableIdx];
    const lang = getAppLocale();

    // Map each number to localized topic item and sort alphabetically A-Z
    const itemsList = rawNumbers.map((val) => {
      const topicItem = TopicService.getItemByValue(this.topicId, val, lang);
      return { val, topicItem };
    });

    itemsList.sort((a, b) => a.topicItem.name.localeCompare(b.topicItem.name, lang));

    const palette = colorPalettes[(this.step - 1) % colorPalettes.length];

    for (let i = 0; i < 16; i++) {
      const { topicItem } = itemsList[i];

      this.set(`icon${i}`, topicItem.icon);
      this.set(`label${i}`, topicItem.name);
      this.set(`fontClass${i}`, topicItem.fontClass || 'fas');
      this.set(`tile${i}Bg`, palette[i].bg);
      this.set(`tile${i}Fg`, palette[i].fg);
    }

    this.set('step', String(this.step));
    this.updateStepIndicators();

    // Trigger grid pop-in animation
    setTimeout(() => {
      animateGridTiles();
    }, 50);
  }

  public answer(yes: boolean) {
    AudioHelper.playTap();

    const currentKey = keys[this.currentTableIdx];
    this.userAnswers.push(yes);

    if (yes) {
      this.result += currentKey;
    }

    this.scanColor = yes ? 'rgba(46, 204, 113, 0.9)' : 'rgba(255, 64, 129, 0.9)';
    this.scanY = 0;
    this.isScanning = true;

    setTimeout(() => {
      this.isScanning = false;
      if (this.step < 5) {
        this.step++;
        this.setupNextStep();
      } else {
        Frame.topmost().navigate({
          moduleName: 'pages/result-page',
          context: {
            topicId: this.topicId,
            result: this.result,
            userAnswers: this.userAnswers
          },
          clearHistory: true,
          transition: {
            name: 'fade',
            duration: 400
          }
        });
      }
    }, 450);
  }
}

function animateGridTiles() {
  if (!currentPage) return;
  for (let i = 0; i < 16; i++) {
    const tileView = currentPage.getViewById<View>(`tile${i}`);
    if (tileView) {
      tileView.opacity = 0;
      tileView.scaleX = 0.45;
      tileView.scaleY = 0.45;
      tileView.translateY = 24;

      setTimeout(() => {
        tileView.animate({
          opacity: 1,
          scale: { x: 1, y: 1 },
          translate: { x: 0, y: 0 },
          duration: 220,
          curve: 'easeOut'
        });
      }, i * 22);
    }
  }
}

let viewModel: GameViewModel;
let canvasCtx: any = null;
let canvasWidth = 0;
let canvasHeight = 0;
let animationFrameId: number | null = null;

export function onNavigatingTo(args: EventData) {
  currentPage = <Page>args.object;
  const navContext = currentPage.navigationContext || {};
  const topicId = navContext.topicId || TopicService.getSelectedTopicId();

  viewModel = new GameViewModel(topicId);
  currentPage.bindingContext = viewModel;
}

export function onNavigatedTo(args: EventData) {
  animateGridTiles();
}

export function goBack() {
  AudioHelper.playTap();
  const currentTopic = viewModel ? viewModel.topicId : TopicService.getSelectedTopicId();
  Frame.topmost().navigate({
    moduleName: 'pages/topic-preview-page',
    context: { topicId: currentTopic },
    clearHistory: true,
    animated: true,
    transition: {
      name: 'slideRight',
      duration: 300
    }
  });
}

export function onYes() {
  viewModel.answer(true);
}

export function onNo() {
  viewModel.answer(false);
}

export function onCanvasReady(args: any) {
  const canvas = args.object;
  canvasCtx = canvas.getContext('2d');
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  function drawEffects() {
    if (viewModel && viewModel.isScanning && canvasCtx) {
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

      const y = (viewModel.scanY / 100) * canvasHeight;
      const grad = canvasCtx.createLinearGradient(0, y - 20, 0, y + 2);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.8, viewModel.scanColor);
      grad.addColorStop(1, '#000000');

      canvasCtx.fillStyle = grad;
      canvasCtx.fillRect(0, y - 20, canvasWidth, 22);

      viewModel.scanY += 5;
      if (viewModel.scanY > 100) {
        viewModel.scanY = 0;
      }
    } else if (canvasCtx) {
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
    animationFrameId = requestAnimationFrame(drawEffects);
  }

  drawEffects();
}

import { EventData, Page, Frame, Observable, View } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';
import { TopicService } from '../shared/topic-service';
import { getAppLocale } from '../shared/locale-manager';

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

let viewModel: Observable;
let currentPage: Page | null = null;
let currentTopicId: string = 'animals';
let finalResultVal: number = 1;

let confettiCtx: any = null;
let confettiWidth = 0;
let confettiHeight = 0;
let confettiFrameId: number | null = null;
const confettis: Confetti[] = [];

export function onNavigatingTo(args: EventData) {
  currentPage = <Page>args.object;
  const navContext = currentPage.navigationContext || {};
  currentTopicId = navContext.topicId || 'animals';
  finalResultVal = navContext.result || 1;
  const userAnswers: boolean[] = navContext.userAnswers || [true, true, true, true, true];

  const topic = TopicService.getTopicById(currentTopicId);
  const lang = getAppLocale();
  const firstItem = topic.items[0];
  const finalItem = TopicService.getItemByValue(currentTopicId, finalResultVal, lang);

  viewModel = new Observable();
  viewModel.set('displayIcon', firstItem.icon);
  viewModel.set('displayFontClass', firstItem.fontClass || (currentTopicId === 'brands' ? 'fab' : 'fas'));
  viewModel.set('displayName', finalItem.name);

  // Set 5 Step Answer Summary Badges (Simple & Clean Pill Badges)
  for (let i = 0; i < 5; i++) {
    const stepNum = i + 1;
    const isYes = userAnswers[i] !== undefined ? userAnswers[i] : true;
    if (isYes) {
      viewModel.set(`ans${i}Text`, `${stepNum}: ✓`);
      viewModel.set(`ans${i}Bg`, '#2ecc71');
      viewModel.set(`ans${i}Fg`, '#000000');
    } else {
      viewModel.set(`ans${i}Text`, `${stepNum}: ✕`);
      viewModel.set(`ans${i}Bg`, '#ff4081');
      viewModel.set(`ans${i}Fg`, '#ffffff');
    }
  }

  currentPage.bindingContext = viewModel;
}

export async function onNavigatedTo(args: EventData) {
  if (!currentPage) return;

  const resultCircle = currentPage.getViewById<View>('resultCircle');
  const resultNameLabel = currentPage.getViewById<View>('resultNameLabel');

  if (resultCircle && resultNameLabel) {
    await doCoinFlipReveal(resultCircle, resultNameLabel);
  }
}

async function doCoinFlipReveal(resultCircle: View, resultNameLabel: View) {
  const topic = TopicService.getTopicById(currentTopicId);
  const lang = getAppLocale();
  const finalItem = TopicService.getItemByValue(currentTopicId, finalResultVal, lang);

  // Reset initial rotation and scales
  resultCircle.rotate = 0;
  resultCircle.scaleX = 1.0;
  resultCircle.scaleY = 1.0;

  // 6 Rapid Coin Flips (Y-Axis Squeeze & Expand)
  const totalFlips = 6;
  for (let i = 0; i < totalFlips; i++) {
    // Squeeze coin to edge (Y-axis flip)
    await resultCircle.animate({
      scale: { x: 0.08, y: 1.05 },
      duration: 100,
      curve: 'easeIn'
    });

    // Random icon swap at coin edge
    const randomIdx = Math.floor(Math.random() * topic.items.length);
    const randItem = topic.items[randomIdx];
    viewModel.set('displayIcon', randItem.icon);
    viewModel.set('displayFontClass', randItem.fontClass || (currentTopicId === 'brands' ? 'fab' : 'fas'));
    AudioHelper.playTap();

    // Expand coin flat
    await resultCircle.animate({
      scale: { x: 1.0, y: 1.0 },
      duration: 100,
      curve: 'easeOut'
    });
  }

  // Final Squeeze
  await resultCircle.animate({
    scale: { x: 0.08, y: 1.05 },
    duration: 110,
    curve: 'easeIn'
  });

  // Reveal Final Guessed Item
  viewModel.set('displayIcon', finalItem.icon);
  viewModel.set('displayFontClass', finalItem.fontClass || (currentTopicId === 'brands' ? 'fab' : 'fas'));
  viewModel.set('displayName', finalItem.name);

  AudioHelper.playComplete();

  // Expand coin with Bounce Explosion
  await resultCircle.animate({
    scale: { x: 1.25, y: 1.25 },
    duration: 220,
    curve: 'easeOut'
  });

  await resultCircle.animate({
    scale: { x: 1.0, y: 1.0 },
    duration: 250,
    curve: 'bounceOut'
  });
}

export function restartGame() {
  AudioHelper.playTap();
  if (confettiFrameId !== null) {
    cancelAnimationFrame(confettiFrameId);
    confettiFrameId = null;
  }
  Frame.topmost().navigate({
    moduleName: 'main-page',
    clearHistory: true,
    transition: {
      name: 'fade',
      duration: 300
    }
  });
}

export function onConfettiCanvasReady(args: any) {
  const canvas = args.object;
  confettiCtx = canvas.getContext('2d');
  confettiWidth = canvas.width;
  confettiHeight = canvas.height;

  const colors = [
    '#ffee00',
    '#ff4081',
    '#00e5ff',
    '#2ecc71',
    '#ff9800',
    '#a855f7',
    '#000000'
  ];

  confettis.length = 0;
  for (let i = 0; i < 70; i++) {
    confettis.push({
      x: Math.random() * confettiWidth,
      y: Math.random() * -confettiHeight - 20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  }

  function renderConfetti() {
    if (confettiCtx) {
      confettiCtx.clearRect(0, 0, confettiWidth, confettiHeight);

      confettiCtx.fillStyle = '#ffffff';
      confettiCtx.fillRect(0, 0, confettiWidth, confettiHeight);

      for (const p of confettis) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y > confettiHeight) {
          p.y = -20;
          p.x = Math.random() * confettiWidth;
          p.vy = Math.random() * 3 + 2;
        }
        if (p.x < 0 || p.x > confettiWidth) {
          p.vx *= -1;
        }

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rotation);
        confettiCtx.fillStyle = p.color;
        
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        confettiCtx.lineWidth = 1;
        confettiCtx.strokeStyle = '#000000';
        confettiCtx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);

        confettiCtx.restore();
      }
    }

    confettiFrameId = requestAnimationFrame(renderConfetti);
  }

  renderConfetti();
}

import { EventData, Page, Frame, Observable, Application } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';

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

class ResultViewModel extends Observable {
  public result = 0;
  public isLoading = true;

  constructor(resultValue: number) {
    super();
    this.result = resultValue;
    this.set('result', this.result);
    this.set('isLoading', this.isLoading);

    // Simulate magic analysis duration
    setTimeout(() => {
      this.set('isLoading', false);
      AudioHelper.playComplete();
    }, 2500);
  }
}

let viewModel: ResultViewModel;
let canvasCtx: any = null;
let canvasWidth = 0;
let canvasHeight = 0;
let animationFrameId: number | null = null;
const confettis: Confetti[] = [];

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  const resultVal = page.navigationContext ? page.navigationContext.result : 0;
  viewModel = new ResultViewModel(resultVal);
  page.bindingContext = viewModel;
}

export function restartGame() {
  AudioHelper.playTap();
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
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

export function onCanvasReady(args: any) {
  const canvas = args.object;
  canvasCtx = canvas.getContext('2d');
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  // Premium monochrome aligned palette (Gold, Silver, Black, White)
  const colors = [
    '#000000', // Black
    '#ffffff', // White
    '#d4af37', // Gold
    '#c0c0c0', // Silver
    '#18181b', // Zinc-900
    '#e4e4e7'  // Zinc-200
  ];

  // Initialize confetti particles
  for (let i = 0; i < 80; i++) {
    confettis.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * -canvasHeight - 20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  }

  function renderConfetti() {
    if (canvasCtx && viewModel && !viewModel.isLoading) {
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Render canvas background to blend with page
      const isDark = Application.systemAppearance() === 'dark';
      canvasCtx.fillStyle = isDark ? '#09090b' : '#ffffff';
      canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

      for (const p of confettis) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Reset particle if it goes off bottom/sides
        if (p.y > canvasHeight) {
          p.y = -20;
          p.x = Math.random() * canvasWidth;
          p.vy = Math.random() * 3 + 2;
        }
        if (p.x < 0 || p.x > canvasWidth) {
          p.vx *= -1;
        }

        // Skip drawing black confetti on black background or white on white
        if (isDark && p.color === '#000000') continue;
        if (!isDark && p.color === '#ffffff') continue;

        canvasCtx.save();
        canvasCtx.translate(p.x, p.y);
        canvasCtx.rotate(p.rotation);
        canvasCtx.fillStyle = p.color;
        
        // Draw little rect confetti
        canvasCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        canvasCtx.restore();
      }
    } else if (canvasCtx) {
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    animationFrameId = requestAnimationFrame(renderConfetti);
  }

  renderConfetti();
}

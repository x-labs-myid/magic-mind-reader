import { EventData, Page, Frame, Observable } from '@nativescript/core';
import { localize } from '@nativescript/localize';
import { AudioHelper } from '../shared/audio-helper';

const keys = [1, 2, 4, 8, 16];
const tables = [
  [ 21, 23, 25, 27, 29, 31, 19, 1, 17, 15, 13, 11, 9, 7, 5, 3 ],
  [ 31, 30, 27, 26, 23, 22, 19, 18, 2, 3, 6, 7, 10, 11, 14, 15 ],
  [ 5, 6, 7, 12, 13, 14, 15, 20, 4, 21, 22, 23, 28, 29, 30, 31 ],
  [ 9, 10, 11, 12, 13, 31, 14, 15, 24, 25, 26, 30, 27, 28, 8, 29 ],
  [ 17, 18, 19, 20, 21, 22, 31, 30, 29, 28, 27, 16, 26, 25, 24, 23 ]
];

function shuffle(array: number[]): number[] {
  const arr = [...array];
  let tmp, current, top = arr.length;
  if (top) while (--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = arr[current];
    arr[current] = arr[top];
    arr[top] = tmp;
  }
  return arr;
}

class GameViewModel extends Observable {
  private ofTables: number[] = [0, 1, 2, 3, 4];
  private step = 1;
  private result = 0;
  private currentTableIdx = 0;

  // Scan effect properties
  public scanY = 0;
  public isScanning = false;
  public scanColor = 'rgba(16, 185, 129, 0.8)'; // emerald-500

  constructor() {
    super();
    this.setupNextStep();
  }

  get stepText(): string {
    return localize('step_info', String(this.step));
  }

  private setupNextStep() {
    // Pick a random table index from remaining
    const randIdx = Math.floor(Math.random() * this.ofTables.length);
    this.currentTableIdx = this.ofTables[randIdx];
    
    // Remove it from the list
    this.ofTables.splice(randIdx, 1);

    // Shuffle numbers for presentation
    const numbers = shuffle(tables[this.currentTableIdx]);
    for (let i = 0; i < 16; i++) {
      this.set(`num${i}`, String(numbers[i]));
    }

    this.set('stepText', this.stepText);
  }

  public answer(yes: boolean) {
    AudioHelper.playTap();

    // Trigger scanning animation
    this.scanColor = yes ? 'rgba(16, 185, 129, 0.8)' : 'rgba(244, 63, 94, 0.8)'; // Green or Pink/Red
    this.scanY = 0;
    this.isScanning = true;

    // Accumulate result if YES
    if (yes) {
      this.result += keys[this.currentTableIdx];
    }

    // Wait for the scan animation to finish before proceeding
    setTimeout(() => {
      this.isScanning = false;
      if (this.step < 5) {
        this.step++;
        this.setupNextStep();
      } else {
        // Go to result page
        Frame.topmost().navigate({
          moduleName: 'pages/result-page',
          context: { result: this.result },
          clearHistory: true,
          transition: {
            name: 'fade',
            duration: 400
          }
        });
      }
    }, 600);
  }
}

let viewModel: GameViewModel;
let canvasCtx: any = null;
let canvasWidth = 0;
let canvasHeight = 0;
let animationFrameId: number | null = null;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  viewModel = new GameViewModel();
  page.bindingContext = viewModel;
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

      // Draw laser scanning line
      const y = (viewModel.scanY / 100) * canvasHeight;
      const grad = canvasCtx.createLinearGradient(0, y - 20, 0, y + 2);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.8, viewModel.scanColor);
      grad.addColorStop(1, '#ffffff');

      canvasCtx.fillStyle = grad;
      canvasCtx.fillRect(0, y - 20, canvasWidth, 22);

      // Move laser down
      viewModel.scanY += 3;
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

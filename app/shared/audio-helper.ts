import { Application, isAndroid, ApplicationSettings } from '@nativescript/core';
import { TNSPlayer } from '@nativescript-community/audio';

export class AudioHelper {
  private static soundPool: any = null;
  private static tapSoundId: number = 0;
  private static completeSoundId: number = 0;

  private static playerTap: TNSPlayer | null = null;
  private static playerComplete: TNSPlayer | null = null;
  private static playerBacksound: TNSPlayer | null = null;

  private static isMutedState: boolean = false;
  private static isBacksoundPlaying: boolean = false;

  public static init() {
    this.isMutedState = ApplicationSettings.getBoolean('is_muted', false);

    if (isAndroid) {
      try {
        const audioAttributes = new android.media.AudioAttributes.Builder()
          .setUsage(android.media.AudioAttributes.USAGE_GAME)
          .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .build();

        this.soundPool = new android.media.SoundPool.Builder()
          .setMaxStreams(5)
          .setAudioAttributes(audioAttributes)
          .build();

        const context = Application.android.context;
        const tapResId = context.getResources().getIdentifier('tap_effect', 'raw', context.getPackageName());
        const completeResId = context.getResources().getIdentifier('complete_effect', 'raw', context.getPackageName());

        if (tapResId !== 0) {
          this.tapSoundId = this.soundPool.load(context, tapResId, 1);
        }
        if (completeResId !== 0) {
          this.completeSoundId = this.soundPool.load(context, completeResId, 1);
        }
      } catch (e) {
        console.log('SoundPool init fallback:', e);
      }
    }
  }

  public static isMuted(): boolean {
    return ApplicationSettings.getBoolean('is_muted', false);
  }

  public static toggleMute(): boolean {
    const current = this.isMuted();
    const nextState = !current;
    ApplicationSettings.setBoolean('is_muted', nextState);
    this.isMutedState = nextState;

    if (nextState) {
      this.stopBacksound();
    } else {
      this.startBacksound();
    }

    return nextState;
  }

  public static startBacksound() {
    if (this.isMuted()) {
      return;
    }

    try {
      if (!this.playerBacksound) {
        this.playerBacksound = new TNSPlayer();
      }

      this.playerBacksound.playFromFile({
        audioFile: '~/assets/audio/backsound.mp3',
        loop: true
      }).then(() => {
        this.isBacksoundPlaying = true;
      }).catch((e) => {
        console.error('Error playing backsound:', e);
      });
    } catch (e) {
      console.error('Backsound start error:', e);
    }
  }

  public static stopBacksound() {
    try {
      if (this.playerBacksound) {
        this.playerBacksound.pause().then(() => {
          this.isBacksoundPlaying = false;
        }).catch(() => {
          try {
            this.playerBacksound.dispose();
            this.playerBacksound = null;
            this.isBacksoundPlaying = false;
          } catch (err) {}
        });
      }
    } catch (e) {
      // Ignored
    }
  }

  static playTap() {
    if (this.isMuted()) return;

    try {
      if (isAndroid && this.soundPool && this.tapSoundId !== 0) {
        this.soundPool.play(this.tapSoundId, 1.0, 1.0, 1, 0, 1.0);
        return;
      }

      if (!this.playerTap) {
        this.playerTap = new TNSPlayer();
      }

      this.playerTap.playFromFile({
        audioFile: '~/assets/audio/tap-effect.mp3',
        loop: false
      });
    } catch (e) {
      console.error('Error playing tap sound:', e);
    }
  }

  static playComplete() {
    if (this.isMuted()) return;

    try {
      if (isAndroid && this.soundPool && this.completeSoundId !== 0) {
        this.soundPool.play(this.completeSoundId, 1.0, 1.0, 1, 0, 1.0);
        return;
      }

      if (!this.playerComplete) {
        this.playerComplete = new TNSPlayer();
      }

      this.playerComplete.playFromFile({
        audioFile: '~/assets/audio/complete-effect.mp3',
        loop: false
      });
    } catch (e) {
      console.error('Error playing complete sound:', e);
    }
  }
}

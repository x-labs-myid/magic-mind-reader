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
    // Standard initialization using TNSPlayer for all platforms for maximum reliability of local asset path resolution
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
      if (!this.playerTap) {
        this.playerTap = new TNSPlayer();
      }

      this.playerTap.playFromFile({
        audioFile: '~/assets/audio/tap-effect.mp3',
        loop: false
      }).catch(err => {
        console.error('TNSPlayer playTap error:', err);
      });
    } catch (e) {
      console.error('Error playing tap sound:', e);
    }
  }

  static playComplete() {
    if (this.isMuted()) return;

    try {
      if (!this.playerComplete) {
        this.playerComplete = new TNSPlayer();
      }

      this.playerComplete.playFromFile({
        audioFile: '~/assets/audio/complete-effect.mp3',
        loop: false
      }).catch(err => {
        console.error('TNSPlayer playComplete error:', err);
      });
    } catch (e) {
      console.error('Error playing complete sound:', e);
    }
  }
}

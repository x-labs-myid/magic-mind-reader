import { Application, isAndroid, ApplicationSettings, knownFolders, path } from '@nativescript/core';
import { TNSPlayer } from '@nativescript-community/audio';

declare var android: any;

export class AudioHelper {
  private static soundPool: any = null;
  private static tapSoundId: number = 0;
  private static completeSoundId: number = 0;

  private static playerTap: TNSPlayer | null = null;
  private static playerComplete: TNSPlayer | null = null;
  private static playerBacksound: TNSPlayer | null = null;

  private static isMutedState: boolean = false;
  private static isBacksoundPlaying: boolean = false;
  private static wasPlayingBeforeSuspend: boolean = false;

  public static init() {
    this.isMutedState = ApplicationSettings.getBoolean('is_muted', false);
    
    // Register lifecycle event listeners
    Application.on(Application.suspendEvent, () => {
      if (this.isBacksoundPlaying) {
        this.wasPlayingBeforeSuspend = true;
        this.stopBacksound();
      }
    });

    Application.on(Application.resumeEvent, () => {
      if (this.wasPlayingBeforeSuspend && !this.isMuted()) {
        this.startBacksound();
      }
      this.wasPlayingBeforeSuspend = false;
    });

    Application.on(Application.exitEvent, () => {
      this.stopBacksound();
    });

    if (isAndroid) {
      try {
        if (android.os.Build.VERSION.SDK_INT >= 21) {
          const attrs = new android.media.AudioAttributes.Builder()
            .setUsage(android.media.AudioAttributes.USAGE_GAME)
            .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build();
          this.soundPool = new android.media.SoundPool.Builder()
            .setMaxStreams(5)
            .setAudioAttributes(attrs)
            .build();
        } else {
          this.soundPool = new android.media.SoundPool(5, android.media.AudioManager.STREAM_MUSIC, 0);
        }

        const appPath = knownFolders.currentApp().path;
        const tapPath = path.join(appPath, 'assets', 'audio', 'tap-effect.mp3');
        const completePath = path.join(appPath, 'assets', 'audio', 'complete-effect.mp3');

        this.tapSoundId = this.soundPool.load(tapPath, 1);
        this.completeSoundId = this.soundPool.load(completePath, 1);
      } catch (e) {
        console.error('Error initializing SoundPool for Android:', e);
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
    if (this.isMuted() || this.isBacksoundPlaying) {
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

    if (isAndroid && this.soundPool && this.tapSoundId) {
      try {
        this.soundPool.play(this.tapSoundId, 1.0, 1.0, 1, 0, 1.0);
        return;
      } catch (e) {
        console.error('SoundPool playTap error:', e);
      }
    }

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

    if (isAndroid && this.soundPool && this.completeSoundId) {
      try {
        this.soundPool.play(this.completeSoundId, 1.0, 1.0, 1, 0, 1.0);
        return;
      } catch (e) {
        console.error('SoundPool playComplete error:', e);
      }
    }

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

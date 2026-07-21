import { TNSPlayer } from '@nativescript-community/audio';

export class AudioHelper {
  private static playerTap: TNSPlayer;
  private static playerComplete: TNSPlayer;

  static playTap() {
    try {
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
    try {
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

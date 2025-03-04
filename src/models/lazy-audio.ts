import { Howl, HowlOptions } from 'howler';

/**
 * Wrapper for a Howl object that supports lazy loading/playing.
 */
export class LazyAudio extends Howl {
  constructor(audioUrl: string) {
    const lazyOptions: HowlOptions = { src: [audioUrl], preload: false };
    super(lazyOptions);
  }

  public override play(spriteOrId?: string | number | undefined): number {
    if (this.state() === 'unloaded') {
      this.load();
    }
    return super.play(spriteOrId);
  }

  public override duration(id?: number | undefined): number {
    if (this.state() === 'loaded') {
      return super.duration(id);
    }

    throw new Error(
      'Use durationAsync() instead! If the audio is not loaded, duration() returns 0.0. ' +
        'This is almost always true for LazyAudio objects.'
    );
  }

  // alternatively, we can set `html5: true` and `preload: 'metadata'`
  public async durationAsync(id?: number | undefined): Promise<number> {
    if (this.state() === 'unloaded') {
      return new Promise((resolve, reject) => {
        this.once('load', () => resolve(super.duration(id)));
        this.once('loaderror', () => {
          console.error('Failed to load duration for audio file, defaulting to 0.0.');
          reject(0.0);
        });

        // intentionally register handlers before loading!
        // smaller files might load too fast...
        this.load();
      });
    } else {
      return super.duration(id);
    }
  }
}

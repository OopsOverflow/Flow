import { MusicPlayer } from './music-player.component';

export function musicPlayer(...args: ConstructorParameters<typeof MusicPlayer>): MusicPlayer {
  return new MusicPlayer(...args);
}

export type { MusicPlayer };

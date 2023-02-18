import { VideoVisu } from './video-visu.component';

export function videoVisu(...args: ConstructorParameters<typeof VideoVisu>): VideoVisu {
  return new VideoVisu(...args);
}

export type { VideoVisu };

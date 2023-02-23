import { SpotifySearch } from './spotify-search.component';

export function spotifySearch(...args: ConstructorParameters<typeof SpotifySearch>): SpotifySearch {
  return new SpotifySearch(...args);
}

export type { SpotifySearch };

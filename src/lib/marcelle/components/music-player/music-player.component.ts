import { Component } from '@marcellejs/core';
import View from './music-player.view.svelte';

export interface MusicPlayerOptions {
  [key: string]: unknown;
}

//Source :
//https://www.npmjs.com/package/svelte-mp3?activeTab=readme
export class MusicPlayer extends Component {
  title: string;
  musicTrack: HTMLMediaElement;
  musicTrackTitle: string;

  constructor(musicTrack: HTMLMediaElement, musicTrackTitle: string) {
    super();
    this.title = '';
    this.musicTrack = musicTrack;
    this.musicTrackTitle = musicTrackTitle;
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        musicTrack: this.musicTrack,
        musicTrackTitle: this.musicTrackTitle,
      },
    });
  }
}

import { Component } from '@marcellejs/core';
import View from './emotion-chart.view.svelte';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface EmotionChartOptions {
  [key: string]: unknown;
}

/**
 * MusicList is a dictionary of emotion and music list
 */
export interface MusicList {
  [emotion: string]: string[];
}

export class EmotionChart extends Component {
  title: string;
  musicData: Writable<MusicList>;
  currentLabel: Writable<string> = writable('None');
  emotionsColors: Record<string, string>;
  bdd: any;

  constructor(musicData: Writable<MusicList>, emotionsColors: Record<string, string>,bdd:any) {
    super();
    this.title = 'Musics registered :';
    this.musicData = musicData;
    this.emotionsColors = emotionsColors;
    this.bdd = bdd;
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        musicData: this.musicData,
        currentLabel: this.currentLabel,
        emotionsColors: this.emotionsColors,
        bdd: this.bdd
      },
    });
  }
}

import { Component } from '@marcellejs/core';
import View from './video-visu.view.svelte';
import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface VideoVisuOptions {
  [key: string]: unknown;
}

export interface VideoParsedPart {
  label: string;
  start: number;
  end: number;
}

export interface VideoParsed {
  name: string;
  length: number; // in seconds
  parts: VideoParsedPart[];
}

export class VideoVisu extends Component {
  title: string;
  videoParsedStore: Writable<VideoParsed>;
  currentLabel: Writable<string> = writable('');
  emotionsColors: Record<string, string>;
  components: any;
  currentPartID = 0;

  constructor(videoParsed: VideoParsed, emotionColors: any) {
    super();
    this.title = videoParsed.name;
    this.videoParsedStore = writable(videoParsed);
    this.emotionsColors = emotionColors;
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        videoParsedStore: this.videoParsedStore,
        currentLabel: this.currentLabel,
        emotionsColors: this.emotionsColors,
      },
    });
  }

  /**Set the video to visualize. Update $videoParsedStore */
  setVideo(video: VideoParsed) {
    this.videoParsedStore.set(video);
    this.title = get(this.videoParsedStore).name;
  }

  destroy() {
    super.destroy();
  }
}

import { Component } from '@marcellejs/core';
import View from './video-visu.view.svelte';
import PartComponent from './video-visu.partComponent.svelte';
import { writable } from 'svelte/store';
import type {Writable } from 'svelte/store';
import { afterUpdate } from 'svelte';
import { children } from './store.js';

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
  options: VideoVisuOptions;
  videoParsedStore: Writable<VideoParsed>;
  currentLabel: Writable<string> = writable('');
  emotionsColors: Record<string, string>;
  components: any;
  currentPartID = 0;

  constructor(videoParsed: VideoParsed, emotionColors: any, options: VideoVisuOptions = {}) {
    super();
    this.title = '';
    this.options = options;
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
        options: this.options,
        videoParsedStore: this.videoParsedStore,
        currentLabel: this.currentLabel,
        emotionsColors: this.emotionsColors,
      },
    });
  }

  /**Set the video to visualize. Update $videoParsedStore */
  setVideo(video : VideoParsed){
    this.videoParsedStore.set(video);
  }


}

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
  videoParsed: VideoParsed;
  currentLabel: Writable<string> = writable('');
  emotionsColors: Record<string, string>;
  components: any;
  currentPartID = 0;

  constructor(videoParsed: VideoParsed, emotionColors: any, options: VideoVisuOptions = {}) {
    super();
    this.title = 'videoVisu [custom component 🤖]';
    this.options = options;
    this.videoParsed = videoParsed;
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
        videoParsed: this.videoParsed,
        currentLabel: this.currentLabel,
        emotionsColors: this.emotionsColors,
      },
    });
  }

  /**
 * Remove all children from the store 
 */
  removeAllComponent() {
    children.update((children) => children.filter((child) => child !== this));
    this.components = [];
  }


  /**
   *  Add all children to the store
   */
  addAllChildren() {
    children.set(this.videoParsed.parts);
    //components get children in svelte DOM, with binding
    afterUpdate(() => {
        this.components.forEach(child => {
                //Enable click from one child at a time and update the current label
            child.unsubscribeFromClick = child.$isClicked.subscribe((value) => {
              if (value) {
                if(child.oldClicked == true && this.currentPartID != child.id){ //Click 2 times on the same do nothing
                  child.unClick();
                } else {
                  this.currentLabel.set(child.getLabel());
                  this.currentPartID = child.id;
                }
              }
              child.archiveClicked();
            })
            child.setColor(this.emotionsColors[child.getLabel()]);
        })
      })
  }


}

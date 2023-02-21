import { Component } from '@marcellejs/core';
import View from './color-legend.view.svelte';

export interface ColorLegendOptions {
  [key: string]: unknown;
}

export interface EmotionInterface {
  labels: string[];
  colors: Record<string, string>;
  [key: string]: unknown;
}

export class ColorLegend extends Component {
  title: string;
  colors: Record<string, string>;
  labels: string[];

  constructor(emotions: EmotionInterface) {
    super();
    this.title = 'Legend';
    this.labels = emotions.labels;
    this.colors = emotions.colors;
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        labels: this.labels,
        colors: this.colors,
      },
    });
  }
}

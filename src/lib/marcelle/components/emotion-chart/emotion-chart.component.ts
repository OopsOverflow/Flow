import { Component } from '@marcellejs/core';
import View from './emotion-chart.view.svelte';

export interface EmotionChartOptions {
  [key: string]: unknown;
}

export class EmotionChart extends Component {
  title: string;
  options: EmotionChartOptions;

  constructor(options: EmotionChartOptions = {}) {
    super();
    this.title = 'emotionChart [custom component 🤖]';
    this.options = options;
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
      },
    });
  }
}

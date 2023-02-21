import { Component } from '@marcellejs/core';
import View from './color-legend.view.svelte';

export interface ColorLegendOptions {
  [key: string]: unknown;
}

export class ColorLegend extends Component {
  title: string;
  options: ColorLegendOptions;

  constructor(options: ColorLegendOptions = {}) {
    super();
    this.title = 'colorLegend [custom component 🤖]';
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

import { Component } from '@marcellejs/core';
import View from './list-visu.view.svelte';
import type {Writable } from 'svelte/store';


export interface MusicTitles{
  label: string;
  title: string;
}

export class ListVisu extends Component {
  title: string;
  label: Writable<string>;
  listContent: Writable<MusicTitles[]>;

  constructor(label: Writable<string>, listContent: Writable<MusicTitles[]>) {
    super();
    this.title = 'Associated music :';
    this.label = label;
    this.listContent = listContent;
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        label: this.label,
        listContent: this.listContent,
      },
    });
  }
}

import { Component } from '@marcellejs/core';
import View from './spotify-search.view.svelte';


export interface SpotifySearchOptions {
  [key: string]: unknown;
}


export class SpotifySearch extends Component {
  title: string;
 

  constructor() {
    super();
    this.title = 'Spotify search';
    
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title
      }
    });
  }
}
<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';
  import { setContext } from 'svelte';
  import { children } from './store.js';
  import PartComponent from './video-visu.partComponent.svelte';
  import type {Writable } from 'svelte/store';
	import { afterUpdate } from 'svelte';

  export let title: string;
  export let options: Record<string, unknown>;
  export let videoParsed: any;
  export let currentLabel: Writable<string>;
  export let emotionsColors: Record<string, string>;
  export let components = [];
  

  /**
   * Get the width of a video part in percent based on the total width of the video
   */
  function getVideoPartWidth(videoPart) {
    let totalWidthInSec = videoParsed.length;
    let partWidthInSec = videoPart.end - videoPart.start;

    return (partWidthInSec / totalWidthInSec) * 100;
  }

</script>

<ViewContainer {title}>
  <!--<div>This is a <span class="my-color">custom</span> component with the following options:</div>
  <p>{JSON.stringify(options)}</p>-->
  {#each $children as vidPart, i}
    <PartComponent bind:this="{components[i]}" VideoParsedPart = {vidPart} width= {getVideoPartWidth(vidPart)}/>
  {/each}
</ViewContainer>

<!--
<style>
  .my-color {
    color: seagreen;
  }
</style>
-->

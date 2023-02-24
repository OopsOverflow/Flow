<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';
  import PartComponent from './video-visu.partComponent.svelte';
  import {derived, get} from 'svelte/store';
  import type {Writable } from 'svelte/store';
  import type { VideoParsed } from './video-visu.component';
  import {afterUpdate} from "svelte";

  export let title: string;
  export let videoParsedStore: Writable<VideoParsed>;
  export let currentLabel: Writable<string>;
  export let emotionsColors: Record<string, string>;
  export let components: PartComponent[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currentPartID = Symbol();


  /**Store containing the video parts, automatically updated when the videoParsedStore is updated*/
  let videoPartStore = derived(videoParsedStore, ($videoParsedStore) => {
    return $videoParsedStore.parts;
  });

  /**The current value of the videoParsedStore, avoid using get() for performance*/
  let videoParsed: VideoParsed;
  videoParsedStore.subscribe((value) => {
    videoParsed = value;
  });

  let suscribeFunction = () => {};

  afterUpdate(() => {
    suscribeFunction();
    //Remove the suscribe function to avoid multiple suscribe
    suscribeFunction = () => {};
  });

  /**Update all the parts and after DOM update suscribe to click component of part*/
  async function updateVideoParts(){
    components = []; //Remove previous components
    /*
    afterUpdate(() => { //Wait for the components to be created
      //Apply the click handle to each component
      components.forEach((child : typeof PartComponent) => {
        // eslint-disable-next-line no-param-reassign
        child.unsubscribeFromClick = child.isClicked.subscribe((value) => {
          //Enable click from one child at a time and update the current label
          if (value) {
            if(child.oldClicked === true && currentPartID !== child.id){ //Click 2 times on the same do nothing
              child.unClick();
            } else {
              currentLabel.set(child.getLabel());
              currentPartID = child.id;
              //For some reason, log is necessary to update the currentLabel in the DOM
              console.log("clicked label : " + child.getLabel() + " - currentLabel : " + get(currentLabel));
            }
          }
          child.archiveClicked();
        });
        child.setColor(emotionsColors[child.getLabel()]);
      });
    });*/
    suscribeFunction = () => {
      //Apply the click handle to each component
      components.forEach((child : typeof PartComponent) => {
        // eslint-disable-next-line no-param-reassign
        child.unsubscribeFromClick = child.isClicked.subscribe((value) => {
          //Enable click from one child at a time and update the current label
          if (value) {
            if(child.oldClicked === true && currentPartID !== child.id){ //Click 2 times on the same do nothing
              child.unClick();
            } else {
              currentLabel.set(child.getLabel());
              currentPartID = child.id;
              //For some reason, log is necessary to update the currentLabel in the DOM
              console.log("clicked label : " + child.getLabel() + " - currentLabel : " + get(currentLabel));
            }
          }
          child.archiveClicked();
        });
        child.setColor(emotionsColors[child.getLabel()]);
      });
    };
  }

  //Recreate the components when the videoPartStore is updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  videoPartStore.subscribe((value) => {
    updateVideoParts();
  });

  /**
   * Get the width of a video part in percent based on the total width of the video
   */
  function getVideoPartWidth(videoPart):number {
    let totalWidthInSec = videoParsed.length;
    let partWidthInSec = videoPart.end - videoPart.start;

    return (partWidthInSec / totalWidthInSec) * 40;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function displayParts(node){
    $videoPartStore.forEach((part, idx) => {
      components[idx] = new PartComponent({
				target: document.querySelector('#slot'),
				props: {
          videoParsedPart: part,
          width: getVideoPartWidth(part),
				},
			});
    });
  }

</script>

<ViewContainer {title}>
  <!--<h4 class="py-6">{videoParsed.name}</h4>-->
  {#if $videoPartStore}
  <div id="slot" class="relative" use:displayParts use:updateVideoParts></div>
  {/if}
  <div class="py-4">Current label : {$currentLabel}</div>
</ViewContainer>

<!--
  <ViewContainer {title}>
  <div>This is a <span class="my-color">custom</span> component with the following options:</div>
  <p>{JSON.stringify(options)}</p>
  {#each $videoPartStore as vidPart, i}
    <PartComponent bind:this="{components[i]}" VideoParsedPart = {vidPart} width= {getVideoPartWidth(vidPart)}/>
  {/each}
</ViewContainer>
-->

<!--
<style>
  .my-color {
    color: seagreen;
  }
</style>
-->

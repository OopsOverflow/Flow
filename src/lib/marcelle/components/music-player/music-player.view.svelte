<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';
  import {AudioPlayer} from 'svelte-mp3';

  export let title: string;
  export let musicTrack: HTMLMediaElement;
  export let musicTrackTitle: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  $:console.dir(musicTrack); // Output: audio element object
</script>

<ViewContainer {title}>
  <AudioPlayer bind:audio={musicTrack}
  showNext={false} showPrev={false} showTrackNum={false} showShuffle={false}/>
  <div class="legend">Suggested music: {musicTrackTitle}</div>
</ViewContainer>

<!--style with centered legend-->
<style>
  .legend {
    text-align: center;
    font-size: 1em;
    font-weight: bold;
    margin-bottom: 1em;
  }
</style>

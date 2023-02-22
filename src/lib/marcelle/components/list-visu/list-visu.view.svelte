<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';
  import type {MusicTitles} from './list-visu.component';
  import type {Writable } from 'svelte/store';
  import { derived } from 'svelte/store';

  export let title: string;
  export let label: Writable<string>;
  export let listContent: Writable<MusicTitles[]>;

  /**
   * Filter the listContent based on the label
   */
  const currentMusicByLabel = derived([label, listContent], ([$label, $listContent]) => {
		if ($label === '') return $listContent; //return all the list
		return $listContent.filter(x => x.label === $label); //return only the list with the label
	});



</script>

<ViewContainer {title}>
  {#each $currentMusicByLabel as music}
    <div>
      {music.title}
    </div>
  {/each}
</ViewContainer>


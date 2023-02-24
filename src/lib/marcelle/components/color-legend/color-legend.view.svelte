<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';

  export let title: string;
  export let labels: string[];
  export let colors: Record<string, string>;
</script>

<ViewContainer {title}>
  <div class="grid grid-cols-3 gap-4">
    {#each labels as label}
      <div class="flex items-center">
      <span class="inline-block h-3 w-3 rounded-full mr-2" style="background-color: {colors[label]};">
        &nbsp;
      </span>
        <span class="inline-block h-3"> {label} </span>
      </div>
    {/each}
  </div>

</ViewContainer>


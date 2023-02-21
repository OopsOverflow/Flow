<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';

  export let title: string;
  export let labels: string[];
  export let colors: Record<string, string>;
</script>

<ViewContainer {title}>
  {#each labels as label}
    <div>
      <span class="inline-block h-3 w-3" style="background-color: {colors[label]};">
        &nbsp;
      </span>
      <span class="inline-block h-3"> {label} </span>
    </div>
  {/each}

</ViewContainer>


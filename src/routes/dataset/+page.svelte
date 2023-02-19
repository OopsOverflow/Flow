<script>
  import { trainingSetBrowser } from '$lib/marcelle';
  import { marcelle } from '$lib/utils';

  const respone = await fetch('/api/emotion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: 'I am happy'
    })
  });

</script>

<svelte:head>
  <title>Dataset</title>
</svelte:head>

<div class="content">
  <h1>Your Dataset</h1>



  // show the result and accuracy


  <div class="marcelle card">
    <div use:marcelle={trainingSetBrowser} />
  </div>
</div>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
  }
</style>

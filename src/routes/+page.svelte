<script lang="ts">
  import { captureWebcam, input, label, trainingSet } from '$lib/marcelle';
  import { marcelle } from '$lib/utils';

  const count = trainingSet.$count;

  let file = null;

  const handleChange = (event) => {
    file = event.target.files[0];
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error('Failed to get prediction');
    }
  };

</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <h1>Welcome to Marcelle!</h1>
  <div class="bg-red-600">
    Tailwindcss works!
  </div>
  <p>
    This template application illustrates how to integrate Marcelle pipelines and component in a web
    application.
  </p>

  <input type="file" accept="image/*" on:change={handleChange}>
  <button on:click={handleSubmit}>Submit</button>
  <div class="marcelle notitles">
    <div use:marcelle={input} />
    <div>
      <div use:marcelle={label} />
      <div use:marcelle={captureWebcam} />
    </div>
    <p>You recorded {$count} instances</p>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  h1 {
    width: 100%;
  }

  :global(.notitles .card-title) {
    display: none;
  }
</style>

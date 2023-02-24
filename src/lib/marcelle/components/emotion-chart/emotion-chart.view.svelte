<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';
  import {onMount} from 'svelte';
  import type {MusicList} from './emotion-chart.component';
  import { PolarArea, getElementAtEvent } from 'svelte-chartjs';
  import type {Writable } from 'svelte/store';

  export let title: string;
  export let musicData: Writable<MusicList>;
  export let currentLabel: Writable<string>;
  export let emotionsColors: Record<string, string>;


  //let chart: ChartJS;
  let chart;


  const data = {
    datasets: [//dummy data
      {
        data: [300, 50, 100, 40, 120],
        backgroundColor: [
          'rgba(247, 70, 74, 0.5)',
          'rgba(70, 191, 189, 0.5)',
          'rgba(253, 180, 92, 0.5)',
          'rgba(148, 159, 177, 0.5)',
          'rgba(77, 83, 96, 0.5)',
        ],
        label: 'Music tracks registered for this emotion : ', // for tooltip
      },
    ],
    labels: ['Chart', 'is', 'not', 'working', ':('],
  };

  let options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  /**
   * Clear the chart data while keeping the reference
   */
  function clearData() {
    data.datasets[0].data.length = 0;
    data.datasets[0].backgroundColor.length = 0;
    data.labels.length = 0;
  }

  /**
   * Register data in $musicData to the chart
   */
  function registerData() {
    if(chart){
      clearData();

      for (const [key, value] of Object.entries($musicData)) {
        data.datasets[0].data.push(value.length);
        data.datasets[0].backgroundColor.push(emotionsColors[key]);
        data.labels.push(key);

        chart.update();
      }
    }

  }


  musicData.subscribe((newData) => {
    console.log(newData);
    registerData();
  });

  function registerLabelElementAtEvent(element) {
    if (!element.length) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { datasetIndex, index } = element[0];

    currentLabel.set(data.labels[index]);
  }


function onClick(event) {
    if (!chart) {
      return;
    }

    //register label element at event
    registerLabelElementAtEvent(getElementAtEvent(chart, event));
    //console.log($musicData[$currentLabel]);
  }


  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale);

  onMount(() => {
    registerData();

  });


</script>


<ViewContainer {title}>
  <div class="relative h-[100%] w-[100%]">

    <div>
      <PolarArea bind:chart={chart} on:click={onClick} {data} {options} />
    </div>
    <div class='mb-2'>
      Musics labeled with : {$currentLabel}
    </div>
    {#if $currentLabel != 'None'}
      {#each $musicData[$currentLabel] as musicTitle}
        <div>
          {musicTitle}
        </div>
      {/each}
    {:else}
      <div>
        Please select an emotion by clicking on the chart
      </div>
    {/if}    
  </div>
</ViewContainer>
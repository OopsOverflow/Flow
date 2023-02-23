<script lang="ts">
  import { ViewContainer } from '@marcellejs/design-system';
  import {onMount} from 'svelte';

  export let title: string;
  export let options: Record<string, unknown>;
  


  // prettier-ignore
const hours = [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a','10a','11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'
  ];

// prettier-ignore
const days = [
    'Saturday', 'Friday', 'Thursday',
    'Wednesday', 'Tuesday', 'Monday', 'Sunday'
  ];

// prettier-ignore
const data = [[6,3,10]];

let option = {
  title: {
    text: 'Punch Card of Github'
  },
  legend: {
    data: ['Punch Card'],
    left: 'right'
  },
  polar: {},
  tooltip: {
    formatter: function (params: any) {
      return (
        params.value[2] +
        ' commits in ' +
        hours[params.value[1]] +
        ' of ' +
        days[params.value[0]]
      );
    }
  },
  angleAxis: {
    type: 'category',
    data: hours,
    boundaryGap: false,
    splitLine: {
      show: true
    },
    axisLine: {
      show: false
    }
  },
  radiusAxis: {
    type: 'category',
    data: days,
    axisLine: {
      show: false
    },
    axisLabel: {
      rotate: 45
    }
  },
  series: [
    {
      name: 'Punch Card',
      type: 'scatter',
      coordinateSystem: 'polar',
      symbolSize: function (val) {
        return val[2] * 2;
      },
      data: data,
      animationDelay: function (idx) {
        return idx * 5;
      }
    },
    {
      type: 'scatter',
      name: '2016',
      coordinateSystem: 'polar',
      symbolSize: function (val) {
        return val[2] * 2;
      },
      animationDelay: function (idx) {
        return idx * 5;
      },
      data: [[3,2,10]]
    }
  ]
};


</script>


<ViewContainer {title}>
  <div class="relative h-[100%] w-[100%]">

    <div class="testchart">
      <div id="chartDiv" class="h-[100%] w-[100%]" />
    </div>
  </div>
</ViewContainer>




<style>
  .testchart {
    width: 100%;
    height: 100%;
  }
</style>

<!--
  
<ViewContainer {title}>
  <div>This is a <span class="my-color">custom</span> component with the following options:</div>
  <p>{JSON.stringify(options)}</p>
  
</ViewContainer>

<style>
  .my-color {
    color: seagreen;
  }
</style>

-->

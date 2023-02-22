<script lang="ts">
    //Provide a minimal wrapper around Apache ECharts. 
    //It must be responsive to size, options and theme changes.
    //https://df.id.au/technical/svelte/echarts/

    import { onMount, onDestroy } from 'svelte';
    import * as echarts from 'echarts';

    //Required for chart initialisation:
    export let id;
    export let theme;
    export let width = 200;
    export let height = 200;

    //Required for setting chart options:
    export let option;
    export let notMerge = false;
    export let replaceMerge = undefined;
    export let lazyUpdate = false;

    //Setup
    //Creating and destroying the chart, as well as setting chart options:
    
    let chart;                      // our chart instance

    const setOption = () => {
        if (chart && !chart.isDisposed()) {
            chart.setOption(
                option,
                notMerge,
                replaceMerge,
                lazyUpdate
            );
        }
    };

    const destroyChart = () => {
        if (chart && !chart.isDisposed()) {
            chart.dispose();
        }
    };

    const makeChart = () => {
        destroyChart();
        chart = echarts.init(
            document.getElementById(id),
            theme
        );
    };

    //Initialisation and teardown:

    onMount(() => {
        makeChart();
    });

    onDestroy(() => {
        destroyChart();
    });

    //Resizing

    //Resizing with ECharts is done using echartsInstance.resize(). Debouncing has been added:

    let timeoutId: any;
    const handleResize = () => {
        if (timeoutId == undefined) {
            timeoutId = setTimeout(() => {
                if (chart && !chart.isDisposed()) {
                    chart.resize();
                }
                timeoutId = undefined;
            }, 500);
        }
    };


    //Reactivity
    //We want the component to react to changes in size, option and theme. 
    //While width and option are easy, changing the theme requires destroying the chart and remaking it:

    $: width && handleResize();
    $: option && setOption();
    $: if (chart && theme) {
        makeChart();
        setOption();
    }

</script>

<div bind:clientWidth={width}>
    <div
        id={id}
        style="height: {height}px"
    />
</div>

<!-- Usage :

    <script>
        import EChart from './EChart.svelte';

        let option = {
            title: {
                text: 'Chart title',
            },
            ...
        };
    </script>

    <div>
        <EChart {option} />
    </div>

-->
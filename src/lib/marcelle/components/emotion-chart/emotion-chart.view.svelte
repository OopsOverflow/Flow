<script lang="ts">
    import {ViewContainer} from '@marcellejs/design-system';
    import {onMount} from 'svelte';
    import type {MusicList} from './emotion-chart.component';
    import {PolarArea, getElementAtEvent} from 'svelte-chartjs';
    import type {Writable} from 'svelte/store';

    export let title: string;
    export let musicData: Writable<MusicList>;
    export let currentLabel: Writable<string>;
    export let emotionsColors: Record<string, string>;
    export let bdd;


    //let chart: ChartJS;
    let chart;
    let recommendedMusics = [];
    let selectedMusics = [];

    async function getRecommendedMusics() {
        if ($currentLabel === 'None') return;
        let muData;
        bdd.find({"y": $currentLabel})
            .then(async function (liste) {
                console.log("liste", liste);
                muData = liste.data.map(function (dictionnaire) {
                    return {"id": dictionnaire.ide};
                });
                console.log("music1", muData);
                const numRecommendations = 5;
                console.log("appel", {music_data: muData, num_recommendations: numRecommendations});
                const response = await fetch('http://127.0.0.1:5000/recommendation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({music_data: muData, num_recommendations: numRecommendations})
                });

                const json = await response.json();
                recommendedMusics = json.recommended_musics;
            });


    }

    function selectMusic(music) {
        selectedMusics = [...selectedMusics, music];
    }


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
        if (chart) {
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
        const {datasetIndex, index} = element[0];

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
            <PolarArea bind:chart={chart} on:click={onClick} {data} {options}/>
        </div>
        <div class='mb-2 font-extrabold'>
            Musics labeled with : {$currentLabel}
        </div>
        {#if $currentLabel !== 'None'}
            {#each $musicData[$currentLabel] as musicTitle}
                <div class="mb-1 text-black">
                    {musicTitle}
                </div>
            {/each}
        {:else}
            <div>
                Please select an emotion by clicking on the chart
            </div>
        {/if}
        {#if $currentLabel !== 'None'}
            <h1>List of music recommendations :</h1>

            {#each recommendedMusics as music}
                <div on:click={() => { bdd.create({ide:music.id, x:music.name,y:$currentLabel,artist:music.artist}) ;    selectMusic(music);}}
                     class="flex flex-row justify-between items-center p-2 border border-gray-200 rounded-md shadow-sm hover:shadow-md cursor-pointer">
                    <div class="flex flex-row items-center">
                        <img src={music.img} class="w-12 h-12 rounded-md mr-1"/>
                        <div class="flex flex-col">
                            <div class="font-semibold text-gray-800">{music.name}</div>
                            <div class="text-sm text-gray-600">{music.artists}</div>
                        </div>
                    </div>
                </div>
            {/each}


            <button on:click={getRecommendedMusics}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Get recommendations</button>

        {/if}
    </div>
</ViewContainer>

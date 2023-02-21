<script lang="ts">
	import { writable, get } from 'svelte/store';
	import { onDestroy } from "svelte"
	import type { VideoParsedPart } from './video-visu.component';

	export let isClicked = writable(false);
	export let oldClicked = false;

	export let unsubscribeFromClick = () => {};

	export const id = Symbol();
	export let videoParsedPart: VideoParsedPart;
	/**The width in percentages of the component*/
	export let width = 0;

	let color = 'grey';

	export function setColor(p_color) {
		color = p_color;
		console.log("color : " + color + " for label : " + getLabel());
	}

	/**
	* Return the id of the component. The id is unique for each component
	*/
	function logId() {
		console.log(id);
	}

	function clickHandle(){
		if(! get(isClicked)){
			isClicked.set(true);
		}
		//console.log("click : " + getLabel());
	}

	/**
	 * Return the label (emotion) of the video segment
	 */
	export function getLabel() {
		return videoParsedPart.label;
	}

	export function unClick() {
		isClicked.set(false);
	}

	/** 
	 * Archive the value of isClicked to oldClicked.
	 * This is used to know if the value of isClicked has changed
	 */
	export function archiveClicked() {
		if (get(isClicked) != oldClicked) {
			oldClicked = get(isClicked);
			return true;
		} else {
			return false;
		}
	}

	onDestroy(unsubscribeFromClick);


</script>

<svelte:options accessors={true}/>

<span class="relative h-6"><!--Use tailwindcss for hover animation https://stackoverflow.com/questions/65755457/tailwind-increase-height-upwards-on-hover-->
	{#if $isClicked}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span class="inline-block h-2 scale-y-150" style="background-color: {color}; width: {width}%;" on:click={clickHandle}><!-- style necessary, tailwind can't use interpolation with class names https://github.com/tailwindlabs/tailwindcss/discussions/7617-->
		&nbsp;
	</span>
	{:else}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span class="inline-block h-2 hover:scale-y-150" style="background-color: {color}; width: {width}%;" on:click={clickHandle}><!-- style necessary, tailwind can't use interpolation with class names-->
		&nbsp;
	</span>	
	{/if}
	<span class="absolute -bottom-2 left-1.5">{videoParsedPart.start}</span>
	<span class="absolute -bottom-2 right-1.5">{videoParsedPart.end}</span>
</span>

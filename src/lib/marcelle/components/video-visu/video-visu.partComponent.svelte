<script>
	import { fade } from 'svelte/transition';
	import { writable, get } from 'svelte/store';
	import { onDestroy } from "svelte"

	export let isClicked = writable(false);
	export let oldClicked = false;

	export let unsubscribeFromClick = () => {};

	export const id = Symbol();
	export let VideoParsedPart = {};
	/**The width in percentages of the component*/
	export let width = 0;

	let color = 'grey';

	export function setColor(color) {
		this.color = color;
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
		return VideoParsedPart.label;
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

<span><!--Use tailwindcss for hover animation https://stackoverflow.com/questions/65755457/tailwind-increase-height-upwards-on-hover-->
	<span class="bg-amber-400">The display is the only thing that don't work !!! </span>
	<span class="w-[{width}%] h-2 bg-red-400" on:click={clickHandle}> <!--Ignore accessibility warning, still work. Or would need to restyle a button--> 
		- Clickable with label {getLabel()} -
	</span>
</span>

<!--<li transition:fade>
	{objAttributes.name} (id={objAttributes.id}) 
	{#if objAttributes.otherattrib}<em>{objAttributes.otherattrib}</em>{/if}
	<button on:click={removeComponent}>x</button>
</li>
-->
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

	function setColor(color) {
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
			$isClicked.set(true);
		}
	}

	/**
	 * Return the label (emotion) of the video segment
	 */
	function getLabel() {
		return VideoParsedPart.label;
	}

	function unClick() {
		$isClicked.set(false);
	}

	/** 
	 * Archive the value of isClicked to oldClicked.
	 * This is used to know if the value of isClicked has changed
	 */
	function archiveClicked() {
		if (get(isClicked) != oldClicked) {
			oldClicked = get(isClicked);
			return true;
		} else {
			return false;
		}
	}

	onDestroy(unsubscribeFromClick);
</script>

<span>
	<div class="w-[{width}%] h-2 bg-[{color}}]" on:click={clickHandle}> <!--Ignore accessibility warning, still work. Or would need to restyle a button--> 
		
	</div>
</span>

<!--<li transition:fade>
	{objAttributes.name} (id={objAttributes.id}) 
	{#if objAttributes.otherattrib}<em>{objAttributes.otherattrib}</em>{/if}
	<button on:click={removeComponent}>x</button>
</li>
-->
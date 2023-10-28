<script lang="ts">
	import Amenities from './amenities.svelte';
	import Info from './info.svelte';
	import Properties from './properties.svelte';

	export let data;

	$: console.log({ data });

	let displayedComponent: 'info' | 'attendance' | 'leaves' = 'info';
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50 mb-5">Rental Units / Room 101</p>
	<!-- Navigation -->
	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button on:click={() => (displayedComponent = 'info')}>
			<p class="py-2 px-3 rounded-md {displayedComponent === 'info' ? 'bg-white' : ''} ">Room</p>
		</button>
		<button on:click={() => (displayedComponent = 'attendance')}
			><p class="p-2 px-3 rounded-md {displayedComponent === 'attendance' ? 'bg-white' : ''}">
				Properties
			</p></button
		>
		<button on:click={() => (displayedComponent = 'leaves')}>
			<p class="p-2 px-3 rounded-md {displayedComponent === 'leaves' ? 'bg-white' : ''}">
				Amenities
			</p>
		</button>
	</div>

	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		{#if displayedComponent === 'info'}
			<Info bind:data />
		{:else if displayedComponent === 'attendance'}
			<Properties />
		{:else if displayedComponent === 'leaves'}
			<Amenities bind:data />
		{:else}
			<p>Something went wrong</p>
		{/if}
	</div>
</div>

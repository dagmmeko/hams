<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import Vendors from './vendors.svelte';
	import Task from './task.svelte';

	export let data;
	export let form;

	$: form?.addVendorForm ? toast.push('Vendor added successfully') : null;

	let displayedComponent: 'vendor' | 'task' | 'pending' = 'vendor';
</script>

<div class="mx-10 my-5">
	<p class="text-xs text-black/50 mb-5">Vendor</p>

	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button on:click={() => (displayedComponent = 'vendor')}>
			<p class="py-2 px-3 rounded-md {displayedComponent === 'vendor' ? 'bg-white' : ''} ">
				Vendor
			</p>
		</button>
		<button on:click={() => (displayedComponent = 'task')}
			><p class="p-2 px-3 rounded-md {displayedComponent === 'task' ? 'bg-white' : ''}">
				Task
			</p></button
		>
		<!-- <button on:click={() => (displayedComponent = 'pending')}>
			<p class="p-2 px-3 rounded-md {displayedComponent === 'pending' ? 'bg-white' : ''}">
				Pending Tasks
			</p>
		</button> -->
	</div>
	{#if displayedComponent === 'vendor'}
		<Vendors bind:data />
	{:else if displayedComponent === 'task'}
		<Task bind:data />
	{:else if displayedComponent === 'pending'}
		<!-- <Amenities bind:data /> --> Pending
	{:else}
		<p>Something went wrong</p>
	{/if}
</div>

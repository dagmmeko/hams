<script lang="ts">
	import Info from './info.svelte';
	import Payments from './all_Payments.svelte';

	export let data;

	let displayedComponent: 'all_payments' | 'info' = 'info';
</script>

<div class="mx-10 my-12">
	<p class="text-sm mb-5">Vendor / {data.editVendorForm.data.name}</p>

	<!-- Navigation -->
	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button on:click={() => (displayedComponent = 'info')}>
			<p class="py-2 px-3 rounded-md {displayedComponent === 'info' ? 'bg-white' : ''} ">Info</p>
		</button>
		<button on:click={() => (displayedComponent = 'all_payments')}>
			<p class="p-2 px-3 rounded-md {displayedComponent === 'all_payments' ? 'bg-white' : ''}">
				Payments
			</p>
		</button>
	</div>

	<!-- main component -->
	<div class=" bg-white rounded-sm shadow-sm border-[1px] border-black/20">
		{#if displayedComponent === 'info'}
			<Info bind:data />
		{:else if displayedComponent === 'all_payments'}
			<!-- <Payments bind:data /> -->
		{:else}
			<p>Something went wrong</p>
		{/if}
	</div>
</div>

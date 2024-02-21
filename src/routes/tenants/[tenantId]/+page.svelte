<script lang="ts">
	import Receipts from './receipts.svelte';
	import Tenant from './tenant.svelte';
	import TenantPriceChange from './tenant-price-change.svelte';
	import EndingProcess from './ending-process.svelte';

	export let data;
	export let form;
	let displayedComponent: 'tenant' | 'receipts' | 'priceChange' | 'ending' = 'tenant';
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50 mb-5">Tenant Detail / {data.tenant?.fullName}</p>

	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button on:click={() => (displayedComponent = 'tenant')}>
			<p class="py-2 px-3 rounded-md {displayedComponent === 'tenant' ? 'bg-white' : ''} ">
				Tenant
			</p>
		</button>
		<button on:click={() => (displayedComponent = 'receipts')}
			><p class="p-2 px-3 rounded-md {displayedComponent === 'receipts' ? 'bg-white' : ''}">
				Receipts
			</p></button
		>
		<button on:click={() => (displayedComponent = 'priceChange')}>
			<p class="p-2 px-3 rounded-md {displayedComponent === 'priceChange' ? 'bg-white' : ''}">
				Price Change
			</p>
		</button>
		<button on:click={() => (displayedComponent = 'ending')}>
			<p class="p-2 px-3 rounded-md {displayedComponent === 'ending' ? 'bg-white' : ''}">
				Ending Process
			</p>
		</button>
	</div>

	{#if displayedComponent === 'tenant'}
		<Tenant bind:form bind:data />
	{:else if displayedComponent === 'receipts'}
		<Receipts bind:data />
	{:else if displayedComponent === 'priceChange'}
		<TenantPriceChange bind:data bind:form />
	{:else if displayedComponent === 'ending'}
		<EndingProcess bind:data bind:form />
	{:else}
		<p>Something went wrong</p>
	{/if}
</div>

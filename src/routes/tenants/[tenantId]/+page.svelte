<script lang="ts">
	import Receipts from './receipts.svelte';
	import Tenant from './tenant.svelte';
	import TenantPriceChange from './tenant-price-change.svelte';
	import EndingProcess from './ending-process.svelte';
	import { page } from '$app/stores';

	export let data;
	export let form;
	const paramsDisplay = $page.url.searchParams.get('display') as
		| 'tenant'
		| 'receipts'
		| 'priceChange'
		| 'ending'
		| null;

	let displayedComponent: 'tenant' | 'receipts' | 'priceChange' | 'ending' =
		paramsDisplay || 'tenant';
</script>

<div class="mt-6 md:mx-10 mx-5">
	<p class="text-xs text-black/50 mb-5">Tenant Detail / {data.tenant?.fullName}</p>

	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button on:click={() => (displayedComponent = 'tenant')}>
			<p
				class="py-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent === 'tenant'
					? 'bg-white'
					: ''} "
			>
				Tenant
			</p>
		</button>
		<button on:click={() => (displayedComponent = 'receipts')}
			><p
				class="p-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent === 'receipts'
					? 'bg-white'
					: ''}"
			>
				Receipts
			</p></button
		>
		<button on:click={() => (displayedComponent = 'priceChange')}>
			<p
				class="p-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent ===
				'priceChange'
					? 'bg-white'
					: ''}"
			>
				Price Change
			</p>
		</button>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'END_CONTRACT')}
			<button on:click={() => (displayedComponent = 'ending')}>
				<p
					class="p-2 md:px-3 px-2 text-xs md:text-base rounded-md {displayedComponent === 'ending'
						? 'bg-white'
						: ''}"
				>
					Ending Process
				</p>
			</button>
		{/if}
	</div>

	{#if displayedComponent === 'tenant'}
		<Tenant bind:form bind:data />
	{:else if displayedComponent === 'receipts'}
		<Receipts bind:data bind:form />
	{:else if displayedComponent === 'priceChange'}
		<TenantPriceChange bind:data bind:form />
	{:else if displayedComponent === 'ending' && $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'END_CONTRACT')}
		<EndingProcess bind:data bind:form />
	{:else}
		<p>Something went wrong</p>
	{/if}
</div>

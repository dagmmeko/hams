<script lang="ts">
	import Receipts from './receipts.svelte'
	import Tenant from './tenant.svelte'
	import TenantPriceChange from './tenant-price-change.svelte'
	import EndingProcess from './ending-process.svelte'
	import { page } from '$app/state'

	let { data = $bindable(), form = $bindable() } = $props()
	const paramsDisplay = page.url.searchParams.get('display') as
		| 'tenant'
		| 'receipts'
		| 'priceChange'
		| 'ending'
		| null

	let displayedComponent: 'tenant' | 'receipts' | 'priceChange' | 'ending' = $state(
		paramsDisplay || 'tenant',
	)
</script>

<div class="mx-5 mt-6 md:mx-10">
	<p class="mb-5 text-xs text-black/50">Tenant Detail / {data.tenant?.fullName}</p>

	<div class="mb-6 flex w-fit rounded-md bg-ghost p-2 shadow-sm">
		<button onclick={() => (displayedComponent = 'tenant')}>
			<p
				class="rounded-md px-2 py-2 text-xs md:px-3 md:text-base {displayedComponent === 'tenant'
					? 'bg-white'
					: ''} "
			>
				Tenant
			</p>
		</button>
		<button onclick={() => (displayedComponent = 'receipts')}
			><p
				class="rounded-md p-2 px-2 text-xs md:px-3 md:text-base {displayedComponent === 'receipts'
					? 'bg-white'
					: ''}"
			>
				Receipts
			</p></button
		>
		<button onclick={() => (displayedComponent = 'priceChange')}>
			<p
				class="rounded-md p-2 px-2 text-xs md:px-3 md:text-base {displayedComponent ===
				'priceChange'
					? 'bg-white'
					: ''}"
			>
				Price Change
			</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'END_CONTRACT')}
			<button onclick={() => (displayedComponent = 'ending')}>
				<p
					class="rounded-md p-2 px-2 text-xs md:px-3 md:text-base {displayedComponent === 'ending'
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
	{:else if displayedComponent === 'ending' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'END_CONTRACT')}
		<EndingProcess bind:data bind:form />
	{:else}
		<p>Something went wrong</p>
	{/if}
</div>

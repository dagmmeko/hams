<script lang="ts">
	import Info from './info.svelte'
	import Payments from './all_Payments.svelte'
	import { page } from '$app/state'

	let { data = $bindable(), form = $bindable() } = $props()

	let displayedComponent: 'all_payments' | 'info' = $state('info')
</script>

<div class="mx-5 my-12 md:mx-10">
	<p class="mb-5 text-sm">Vendor / {data.editVendorForm.data.name}</p>

	<!-- Navigation -->
	<div class="mb-6 flex w-fit rounded-md bg-ghost p-2 shadow-sm">
		<button onclick={() => (displayedComponent = 'info')}>
			<p class="rounded-md px-3 py-2 {displayedComponent === 'info' ? 'bg-white' : ''} ">Info</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_VENDOR_PAYMENT')}
			<button onclick={() => (displayedComponent = 'all_payments')}>
				<p class="rounded-md p-2 px-3 {displayedComponent === 'all_payments' ? 'bg-white' : ''}">
					Payments
				</p>
			</button>
		{/if}
	</div>

	<!-- main component -->
	<div class=" rounded-sm border-[1px] border-black/20 bg-white shadow-sm">
		{#if displayedComponent === 'info'}
			<Info bind:data bind:form />
		{:else if displayedComponent === 'all_payments' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_VENDOR_PAYMENT')}
			<Payments bind:data />
		{:else}
			<p>Something went wrong</p>
		{/if}
	</div>
</div>

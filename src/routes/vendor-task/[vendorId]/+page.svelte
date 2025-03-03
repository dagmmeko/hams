<script lang="ts">
	import Info from './info.svelte';
	import Payments from './all_Payments.svelte';
	import { page } from '$app/state';

	let { data = $bindable(), form = $bindable() } = $props();

	let displayedComponent: 'all_payments' | 'info' = $state('info');
</script>

<div class="md:mx-10 mx-5 my-12">
	<p class="text-sm mb-5">Vendor / {data.editVendorForm.data.name}</p>

	<!-- Navigation -->
	<div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6">
		<button onclick={() => (displayedComponent = 'info')}>
			<p class="py-2 px-3 rounded-md {displayedComponent === 'info' ? 'bg-white' : ''} ">Info</p>
		</button>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_VENDOR_PAYMENT')}
			<button onclick={() => (displayedComponent = 'all_payments')}>
				<p class="p-2 px-3 rounded-md {displayedComponent === 'all_payments' ? 'bg-white' : ''}">
					Payments
				</p>
			</button>
		{/if}
	</div>

	<!-- main component -->
	<div class=" bg-white rounded-sm shadow-sm border-[1px] border-black/20">
		{#if displayedComponent === 'info'}
			<Info bind:data bind:form />
		{:else if displayedComponent === 'all_payments' && page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'VIEW_VENDOR_PAYMENT')}
			<Payments bind:data />
		{:else}
			<p>Something went wrong</p>
		{/if}
	</div>
</div>

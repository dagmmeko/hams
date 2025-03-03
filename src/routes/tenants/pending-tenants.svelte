<script lang="ts">
	import SvelteTable from 'svelte-table';
	import type { PageData } from './$types';
	import AcceptPendingTableComponent from './accept-pending-table-component.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let rows = $derived(data.priceChangeRequest || []);
	let columns = $derived([
		{
			key: 'tenantName',
			title: 'Tenant Name',
			value: (v: typeof rows[number]) => v.Tenant.fullName ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'tenantEmail',
			title: 'Tenant Email',
			value: (v: typeof rows[number]) => v.Tenant.email ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'roomNumber',
			title: 'Room Number',
			value: (v: typeof rows[number]) => v?.RentalUnits.roomNumber ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'roomPrice',
			title: 'Room Price',
			value: (v: typeof rows[number]) => v.RentalUnits.price ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'newPrice',
			title: 'New Price',
			value: (v: typeof rows[number]) => v.price ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},

		{
			key: 'accept',
			title: '',
			renderComponent: {
				component: AcceptPendingTableComponent
			},
			headerClass:
				'text-left px-1 w-64  bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left px-1  w-32 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	]);
</script>

<div class=" bg-white rounded-md shadow-md border-[1px] border-black/20 mt-3">
	<div class="flex justify-between p-6">
		<div class=" ">
			<p class="text-lg">Pending Tenant</p>
			<p class="text-sm">Tenants with price change request</p>
		</div>
	</div>
	<div class="overflow-x-auto">
		<SvelteTable {columns} {rows} />
	</div>
</div>

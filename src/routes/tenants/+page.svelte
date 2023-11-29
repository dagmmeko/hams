<script lang="ts">
	import { goto } from '$app/navigation';
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import { page } from '$app/stores';
	import SvelteTable from 'svelte-table';
	import Name from './name.svelte';
	import dayjs from 'dayjs';
	import DeleteTenantTable from './delete-tenant-table.svelte';

	export let data;

	$: rows = data.tenants || [];
	$: columns = [
		{
			key: 'tenant',
			title: 'Tenant',
			renderComponent: {
				component: Name
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'phoneNumber',
			title: 'Phone Number',
			value: (v: typeof rows[number]) => v.phoneNumber ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'email',
			title: 'Email',
			value: (v: typeof rows[number]) => v.email ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'contractStartDate',
			title: 'Contract Start Date',
			value: (v: typeof rows[number]) =>
				dayjs(v.contractStartDate).format('MMM DD,YYYY') ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'contractEndDate',
			title: 'Contract End Date',
			value: (v: typeof rows[number]) =>
				dayjs(v.contractEndDate).format('MMM DD,YYYY') ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'delete',
			title: '',
			renderComponent: {
				component: DeleteTenantTable
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];
</script>

<div class="mx-10 my-12 bg-white rounded-sm shadow-md border-[1px] border-black/20">
	<div class="flex justify-between p-6">
		<div class="flex space-x-4">
			<p class="text-lg">Tenants</p>
			<p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Tenants</p>
		</div>
		<a href="/tenants/add-tenant" class="bg-primary text-white rounded-md py-2 px-6"> New Tenant</a>
	</div>
	<div class="bg-ghost/60 p-6 flex justify-between">
		<button
			class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white"
		>
			<FiltersLines class="h-4 w-4" /> Add filters
		</button>
		<label class="grid">
			<input
				placeholder="Search"
				class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				type="search"
				id="search"
				name="search"
				on:change={async (e) => {
					const newSearchParams = new URLSearchParams($page.url.search);
					newSearchParams.set('searchTenant', e.currentTarget.value);
					await goto(`?${newSearchParams.toString()}`);
				}}
			/>
		</label>
	</div>
	<SvelteTable {columns} {rows} />
</div>

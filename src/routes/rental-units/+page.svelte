<script lang="ts">
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';

	import { page } from '$app/stores';
	import UnitTableDeleteButton from './unit-table-delete-button.svelte';
	import SvelteTable from 'svelte-table';
	import { goto } from '$app/navigation';
	import InspectionStatusTable from './inspection-status-table.svelte';
	export let data;

	let modal = false;

	$: rows = data.units;
	$: columns = [
		{
			key: 'roomNo',
			title: 'Room Number',
			value: (v: typeof rows[number]) => v.roomNumber ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'floor',
			title: 'Floor',
			value: (v: typeof rows[number]) => v.floor ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'status',
			title: 'Status',
			value: (v: typeof rows[number]) => (v.active ? 'Occupied' : 'Vacant'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'condition',
			title: 'Condition',
			renderComponent: {
				component: InspectionStatusTable
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8]  text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] '
		},
		{
			key: 'unitType',
			title: 'Unit Type',
			value: (v: typeof rows[number]) => v.unitType ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'size',
			title: 'Size',
			value: (v: typeof rows[number]) => v.kareMeter ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'price',
			title: 'Price',
			value: (v: typeof rows[number]) => v.price ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},

		{
			key: 'second',
			title: '',
			renderComponent: {
				component: UnitTableDeleteButton,
				props: {
					data: data
				}
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
			<p class="text-lg">Rental Units</p>
			<p class="bg-[#F9F5FF] h-fit text-xs rounded-xl p-2">{data.units.length} Units</p>
		</div>
		<a
			href="/rental-units/add-unit"
			class="bg-primary text-white rounded-md py-2 px-6"
			on:click={() => (modal = true)}
		>
			New Rental Unit</a
		>
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
					newSearchParams.set('search', e.currentTarget.value);
					await goto(`?${newSearchParams.toString()}`);
				}}
			/>
		</label>
	</div>
	<SvelteTable
		classNameTable="rolesTable"
		on:clickCell={(event) => {
			const unitId = event.detail.row.id;

			goto(`/rental-units/${unitId}`);
		}}
		{columns}
		{rows}
	/>
</div>

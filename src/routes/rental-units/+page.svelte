<script lang="ts">
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';

	import dayjs from 'dayjs';
	import UnitTableDeleteButton from './unit-table-delete-button.svelte';
	import SvelteTable from 'svelte-table';
	import { goto } from '$app/navigation';

	let modal = false;

	$: rows = [{ val: 1 }];
	$: columns = [
		{
			key: 'status',
			title: 'Status',
			value: (v: typeof rows[number]) => 'v.EmployeeStatus',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'role',
			title: 'Role',
			value: (v: typeof rows[number]) => 'v.Role.name',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'email',
			title: 'Email',
			value: (v: typeof rows[number]) => 'v.User.email',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'hiredOn',
			title: 'Hired Date',
			value: (v: typeof rows[number]) => dayjs(new Date()).format('MMM DD, YYYY'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'second',
			title: '',
			renderComponent: {
				component: UnitTableDeleteButton
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
			<p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Units</p>
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
			<input placeholder="Search" class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
		</label>
	</div>
	<SvelteTable
		classNameTable="rolesTable"
		on:clickCell={(event) => {
			goto(`/rental-units/[id]`);
		}}
		{columns}
		{rows}
	/>
</div>

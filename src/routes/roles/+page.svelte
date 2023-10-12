<script lang="ts">
	import { goto } from '$app/navigation';
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import SvelteTable from 'svelte-table';

	let dateInput: any;

	let modal = true;
	export let data;
	$: rows = data.roles;
	$: columns = [
		{
			key: 'status',
			title: 'Status',
			value: (v: typeof rows[number]) => v?.name ?? '',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];
</script>

<div>
	<div class="mx-10 my-12 bg-white rounded-sm shadow-lg border-[1px] border-black/20">
		<div class="flex justify-between p-6">
			<div class="flex items-center space-x-4">
				<p class="text-xl font-medium">Roles</p>
				<p class="bg-[#F9F5FF] text-xs font-medium rounded-xl py-2 px-3">100 Roles</p>
			</div>
			<a href="/roles/add-role" class="bg-primary text-white text-sm rounded-md py-2 px-6">
				New Role</a
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
			on:clickCell={() => {
				goto('/roles/[id]');
			}}
			{columns}
			{rows}
		/>
	</div>
</div>

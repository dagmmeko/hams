<script lang="ts">
	import SvelteTable from 'svelte-table';
	import type { PageData } from './$types';

	export let data: PageData;
	$: rows = data.unitDetails?.Property ?? [];
	$: columns = [
		{
			key: 'name',
			title: 'Item Name',
			value: (v: typeof rows[number]) => v.name ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'number',
			title: 'No. of Units',
			value: (v: typeof rows[number]) => v.numberofUnits ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'status',
			title: 'Condition',
			value: (v: typeof rows[number]) => v.propertyStatus ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];
</script>

<div>
	<div class="flex justify-between">
		<div class="grid">
			<p class="text-2xl">Room Properties</p>
		</div>
		<button type="submit" class="bg-primary text-white rounded-md py-2 px-6"> New Property</button>
	</div>
	<SvelteTable
		classNameTable="rolesTable"
		on:clickCell={(event) => {
			const unitId = event.detail.row.id;
		}}
		{columns}
		{rows}
	/>
</div>

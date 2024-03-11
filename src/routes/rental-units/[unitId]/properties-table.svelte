<script lang="ts">
	import SvelteTable from 'svelte-table';
	import { page } from '$app/stores';
	import { numberToCurrency } from '$lib/utils/currency';
	import PropertyConditionTable from './property-condition-table.svelte';
	import DeletePropertyTable from './delete-property-table.svelte';
	import type { PageData, ActionData } from './$types';
	import { toast } from '@zerodevx/svelte-toast';
	import { enhance } from '$app/forms';
	import { clickOutside } from '$lib/utils/click-outside';

	export let data: PageData;
	export let form: ActionData;
	export let itemCategory: string;

	let selectedUnitId: number;
	let editModal = false;

	$: rows = data.unitDetails?.Property.filter((prop) => prop.itemCategory === itemCategory) || [];
	$: columns = [
		{
			key: 'name',
			title: 'Item Name',
			value: (v: typeof rows[number]) => v.name ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-xs h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-xs'
		},
		{
			key: 'description',
			title: 'Description',
			value: (v: typeof rows[number]) => v.description ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-xs h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-xs'
		},
		{
			key: 'number',
			title: 'No. of Units',
			value: (v: typeof rows[number]) => v.numberofUnits ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-xs h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-xs'
		},
		{
			key: 'price',
			title: 'Price',
			value: (v: typeof rows[number]) =>
				numberToCurrency(v.itemsPrice, {
					currency: v.itemsCurrency,
					currencyDisplay: 'code'
				}) ?? 'NOT FOUND',
			headerClass:
				'text-left bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-xs h-12',
			class: 'text-left mx-12 h-12 border-b-[1px] border-[#B3B4B8] text-xs'
		},
		{
			key: 'status',
			title: 'Condition',
			renderComponent: {
				component: PropertyConditionTable
			},
			headerClass:
				'text-left pl-4 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-xs h-12',
			class: 'text-left pl-4 h-12 border-b-[1px] border-[#B3B4B8] text-xs'
		},
		{
			key: 'available',
			title: 'Available',
			value: (v: typeof rows[number]) => (v.available ? 'Yes' : 'No' ?? 'NOT FOUND'),
			headerClass:
				'text-left print:hidden pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-xs h-12',
			class: 'text-left print:hidden pl-2 h-12 border-b-[1px] border-[#B3B4B8] text-xs'
		},
		{
			key: 'deleteProperty',
			title: '',
			renderComponent: {
				component: DeletePropertyTable,
				props: {
					data: data,
					form: form
				}
			},
			headerClass:
				'print:hidden text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-xs h-12',
			class: 'print:hidden text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] '
		}
	];
</script>

<div class=" my-4">
	<p class="my-4 ml-4 font-semibold">{itemCategory}</p>
	<SvelteTable
		classNameTable="unitPropertyTables"
		classNameRow={(row) => (row.available ? 'bg-white' : 'print:hidden')}
		on:clickCell={(event) => {
			if (
				$page.data.session?.authUser.Employee.Role.Scopes.find(
					(s) => s.name === 'EDIT_UNIT_PROPERTY'
				)
			) {
				selectedUnitId = event.detail.row.id;
				editModal = true;
			} else {
				toast.push('You do not have permission to edit property');
			}
		}}
		{columns}
		{rows}
	/>
</div>

{#if editModal}
	<form
		use:enhance={({ formData }) => {
			formData.set('propertyId', selectedUnitId.toString());
			return async ({ update }) => {
				await update();
				editModal = false;
			};
		}}
		method="post"
		action="?/updateProperty"
	>
		<div
			class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		>
			<div
				use:clickOutside={() => (editModal = false)}
				class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
			>
				<div>
					<p class="text-xl font-semibold">Property</p>
					<p class="text-sm text-subtitle pt-2">
						Edit room property here. Click update when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="text-primary font-medium"> Item's Name </span>
					<input
						name="name"
						required
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)?.name}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="available"
						checked={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.available}
						class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
					/>
					<span class="text-primary font-medium"> Available Now </span>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Description </span>
					<textarea
						name="description"
						required
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.description}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium"> Category </span>
					<select
						required
						name="itemCategory"
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.itemCategory}
						class=" border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled value=""> Item Category </option>
						<option value="SALON"> Salon </option>
						<option value="KITCHEN"> Kitchen </option>
						<option value="BATHROOM"> Bathroom </option>
						<option value="BEDROOM"> Bedroom </option>
						<option value="LAUNDRY"> Laundry </option>
					</select>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Number of the Item </span>
					<input
						name="numberofUnits"
						required
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.numberofUnits}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Price </span>
					<input
						name="price"
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.itemsPrice}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="inBirr"
						checked={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.itemsCurrency === 'ETB'}
						class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
					/>
					<span class="text-primary font-medium"> In Birr </span>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Property Status </span>
					<select
						name="propertyStatus"
						required
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.propertyStatus}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-3"
					>
						<option selected disabled>Select Status</option>
						<option value="DAMAGED">Damaged</option>
						<option value="NEEDS_REPAIR">Needs Repair</option>
						<option value="MISSING_ITEMS">Missing Items</option>
						<option value="GOOD_CONDITION">Good Condition</option>
					</select>
				</label>

				<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 mt-6">
					Update Item</button
				>
			</div>
		</div>
	</form>
{/if}

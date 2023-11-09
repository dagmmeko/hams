<script lang="ts">
	import SvelteTable from 'svelte-table';
	import type { PageData } from './$types';
	import { clickOutside } from '$lib/utils/click-outside';
	import { superForm } from 'sveltekit-superforms/client';
	import { enhance } from '$app/forms';
	import { updated } from '$app/stores';

	let addModal = false;
	let editModal = false;

	let selectedUnitId: number;

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

	const {
		form: addPropertyForm,
		enhance: addPropertyEnhance,
		constraints
	} = superForm(data.addPropertyForm, {
		onSubmit: () => {
			addModal = false;
		}
	});
</script>

<div>
	<div class="flex justify-between">
		<div class="grid">
			<p class="text-2xl">Room Properties</p>
		</div>
		<button
			type="submit"
			class="bg-primary text-white rounded-md py-2 px-6"
			on:click={() => (addModal = true)}
		>
			New Property</button
		>
	</div>
	<div class="-mx-6 pt-5">
		<SvelteTable
			classNameTable="unitPropertyTables"
			on:clickCell={(event) => {
				console.log(event.detail.row);
				selectedUnitId = event.detail.row.id;
				editModal = true;
			}}
			{columns}
			{rows}
		/>
	</div>
</div>

{#if addModal}
	<form use:addPropertyEnhance method="post" action="?/addProperty">
		<div
			class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		>
			<div
				use:clickOutside={() => (addModal = false)}
				class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
			>
				<div>
					<p class="text-xl font-semibold">New Property</p>
					<p class="text-sm text-subtitle pt-2">
						Register new room property here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="text-primary font-medium"> Item's Name </span>
					<input
						name="name"
						required
						bind:value={$addPropertyForm.name}
						{...$constraints.name}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Description </span>
					<textarea
						name="description"
						required
						bind:value={$addPropertyForm.description}
						{...$constraints.description}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Number of the Item </span>
					<input
						name="numberofUnits"
						required
						bind:value={$addPropertyForm.numberofUnits}
						{...$constraints.numberofUnits}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Property Status </span>
					<select
						name="propertyStatus"
						required
						bind:value={$addPropertyForm.propertyStatus}
						{...$constraints.propertyStatus}
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
					Save Item</button
				>
			</div>
		</div>
	</form>
{/if}
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
				<label class="grid">
					<span class="text-primary font-medium"> Description </span>
					<textarea
						name="description"
						required
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)?.name}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
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
					<span class="text-primary font-medium"> Property Status </span>
					<select
						name="propertyStatus"
						required
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.propertyStatus}
						{...$constraints.propertyStatus}
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

<style lang="postcss">
	* :global(.unitPropertyTables) {
		@apply cursor-pointer;
	}
</style>

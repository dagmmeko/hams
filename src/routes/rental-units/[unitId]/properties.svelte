<script lang="ts">
	import SvelteTable from 'svelte-table';
	import type { PageData, ActionData } from './$types';
	import { clickOutside } from '$lib/utils/click-outside';
	import { superForm } from 'sveltekit-superforms/client';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import PdfPrint from '$lib/components/pdf-print.svelte';
	import { goto } from '$app/navigation';
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte';
	import PropertyConditionTable from './property-condition-table.svelte';
	import DeletePropertyTable from './delete-property-table.svelte';

	let addModal = false;
	let editModal = false;

	let selectedUnitId: number;

	export let data: PageData;
	export let form: ActionData;
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
			key: 'price',
			title: 'Price',
			value: (v: typeof rows[number]) => v.itemsPrice ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'status',
			title: 'Condition',
			renderComponent: {
				component: PropertyConditionTable
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'available',
			title: 'Available',
			value: (v: typeof rows[number]) => (v.available ? 'Yes' : 'No' ?? 'NOT FOUND'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
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
	let filterModal = false;
	$: urlSearchParams = new URLSearchParams($page.url.search);
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
	<div class="">
		<div class="flex gap-3">
			<button
				class="grid border-[1px] border-black/20 grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white"
				on:click={() => (filterModal = !filterModal)}
			>
				<FiltersLines class="h-4 w-4" /> Add filters
			</button>
			<span class=" items-center flex">
				{urlSearchParams.get('propertyCondition') ? urlSearchParams.get('propertyCondition') : ''}
			</span>
			<span class=" items-center flex">
				{urlSearchParams.get('propertyAvailability') === 'true'
					? 'AVAILABLE'
					: urlSearchParams.get('propertyAvailability') === 'false'
					? 'NOT AVAILABLE'
					: ''}
			</span>
		</div>

		{#if filterModal}
			<div class="fixed mt-4 z-50">
				<div
					use:clickOutside={() => (filterModal = false)}
					class="bg-white p-6 rounded-xl grid gap-4 justify-items-start shadow-md border-[1px] border-black/20"
				>
					<button
						on:click={async () => {
							await goto(`?`);
						}}
						class="hover:underline hover:text-primary"
					>
						All
					</button>

					<button
						on:click={async () => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('propertyCondition', 'DAMAGED');
							await goto(`?${newSearchParams.toString()}`);
						}}
						class="hover:underline hover:text-primary"
					>
						Damaged
					</button>
					<button
						on:click={async () => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('propertyCondition', 'NEEDS_REPAIR');
							await goto(`?${newSearchParams.toString()}`);
						}}
						class="hover:underline hover:text-primary"
					>
						Needs Repair
					</button>
					<button
						on:click={async () => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('propertyCondition', 'MISSING_ITEMS');
							await goto(`?${newSearchParams.toString()}`);
						}}
						class="hover:underline hover:text-primary"
					>
						Missing Items
					</button>
					<button
						on:click={async () => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('propertyCondition', 'GOOD_CONDITION');
							await goto(`?${newSearchParams.toString()}`);
						}}
						class="hover:underline hover:text-primary"
					>
						Good Condition
					</button>
					<button
						on:click={async () => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('propertyAvailability', 'true');
							await goto(`?${newSearchParams.toString()}`);
						}}
						class="hover:underline hover:text-primary"
					>
						Available
					</button>
					<button
						on:click={async () => {
							const newSearchParams = new URLSearchParams($page.url.search);
							newSearchParams.set('propertyAvailability', 'false');
							await goto(`?${newSearchParams.toString()}`);
						}}
						class="hover:underline hover:text-primary"
					>
						Not Available
					</button>
				</div>
			</div>
		{/if}
	</div>
	<div class="-mx-6 pt-5">
		<PdfPrint class="mx-6">
			<SvelteTable
				classNameTable="unitPropertyTables"
				classNameRow={(row) => (row.available ? 'bg-white' : 'print:hidden')}
				on:clickCell={(event) => {
					selectedUnitId = event.detail.row.id;
					editModal = true;
				}}
				{columns}
				{rows}
			/>
		</PdfPrint>
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
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="available"
						bind:checked={$addPropertyForm.available}
						{...$constraints.available}
						class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
					/>
					<span class="text-primary font-medium"> Available now </span>
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
					<span class="text-primary font-medium"> Price </span>
					<input
						name="price"
						required
						bind:value={$addPropertyForm.price}
						{...$constraints.price}
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
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="available"
						checked={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.available}
						class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
					/>
					<span class="text-primary font-medium"> Available </span>
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
					<span class="text-primary font-medium"> Price </span>
					<input
						name="price"
						value={data.unitDetails?.Property.find((item) => item.id === selectedUnitId)
							?.itemsPrice}
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

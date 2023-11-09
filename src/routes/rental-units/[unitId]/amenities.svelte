<script lang="ts">
	import SvelteTable from 'svelte-table';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { clickOutside } from '$lib/utils/click-outside';
	import { enhance } from '$app/forms';

	let addModal = false;
	let editModal = false;

	let selectedUnitId: number;

	export let data: PageData;

	const {
		form: addAmenityForm,
		enhance: addPropertyEnhance,
		constraints
	} = superForm(data.addAmenityForm, {
		onSubmit: ({ formData }) => {
			addModal = false;
		}
	});
	$: rows = data.unitDetails?.Amenities ?? [];
	$: columns = [
		{
			key: 'name',
			title: 'Amenity Name',
			value: (v: typeof rows[number]) => v.name ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'number',
			title: 'Price',
			value: (v: typeof rows[number]) => v.price ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		},
		{
			key: 'paid',
			title: 'Type',
			value: (v: typeof rows[number]) => v.paid.toString() ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]'
		}
	];
</script>

<div>
	<div class="flex justify-between">
		<div class="grid">
			<p class="text-2xl">Room Amenities</p>
		</div>
		<button
			type="submit"
			class="bg-primary text-white rounded-md py-2 px-6"
			on:click={() => (addModal = true)}
		>
			New Amenity</button
		>
	</div>
	<div class="-mx-6 pt-5">
		<SvelteTable
			classNameTable="unitAmenitiesTables"
			on:clickCell={(event) => {
				selectedUnitId = event.detail.row.id;
				editModal = true;
			}}
			{columns}
			{rows}
		/>
	</div>
</div>

{#if addModal}
	<form use:addPropertyEnhance method="post" action="?/addAmenity">
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
					<span class="text-primary font-medium"> Amenity's Name </span>
					<input
						name="name"
						required
						bind:value={$addAmenityForm.name}
						{...$constraints.name}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Description </span>
					<textarea
						name="description"
						required
						bind:value={$addAmenityForm.description}
						{...$constraints.description}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="paid"
						required
						bind:checked={$addAmenityForm.paid}
						{...$constraints.paid}
						class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
					/>
					<span class="text-primary font-medium"> Paid Service </span>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Price </span>
					<input
						name="price"
						required
						bind:value={$addAmenityForm.price}
						{...$constraints.price}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>

					<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 mt-6">
						Save Item</button
					>
				</label>
			</div>
		</div>
	</form>
{/if}

{#if editModal}
	<form
		use:enhance={({ formData }) => {
			formData.set('amenityId', selectedUnitId.toString());
			return async ({ update }) => {
				await update();
				editModal = false;
			};
		}}
		method="post"
		action="?/updateAmenity"
	>
		<div
			class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		>
			<div
				use:clickOutside={() => (editModal = false)}
				class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
			>
				<div>
					<p class="text-xl font-semibold">New Property</p>
					<p class="text-sm text-subtitle pt-2">
						Register new room property here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="text-primary font-medium"> Amenity's Name </span>
					<input
						name="name"
						required
						value={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)?.name}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Description </span>
					<textarea
						name="description"
						required
						value={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)
							?.description}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="paid"
						required
						checked={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)?.paid}
						class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
					/>
					<span class="text-primary font-medium"> Paid Service </span>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Price </span>
					<input
						name="price"
						required
						value={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)?.price}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					/>

					<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 mt-6">
						Save Item</button
					>
				</label>
			</div>
		</div>
	</form>
{/if}

<style lang="postcss">
	* :global(.unitPropertyTables) {
		@apply cursor-pointer;
	}
</style>

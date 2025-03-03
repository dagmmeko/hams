<script lang="ts">
	import SvelteTable from 'svelte-table'
	import type { PageData, ActionData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'
	import { clickOutside } from '$lib/utils/click-outside'
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { toast } from '@zerodevx/svelte-toast'
	import DeleteAmenitiesTable from './delete-amenities-table.svelte'

	let addModal = $state(false)
	let editModal = $state(false)

	let selectedUnitId: number | undefined = $state()

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data = $bindable(), form = $bindable() }: Props = $props()

	const {
		form: addAmenityForm,
		enhance: addPropertyEnhance,
		constraints,
	} = superForm(data.addAmenityForm, {
		onSubmit: ({ formData }) => {
			addModal = false
		},
	})
	let rows = $derived(data.unitDetails?.Amenities ?? [])
	let columns = $derived([
		{
			key: 'name',
			title: 'Amenity Name',
			value: (v: (typeof rows)[number]) => v.name ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'number',
			title: 'Price',
			value: (v: (typeof rows)[number]) => 'ETB ' + v.price,
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'paid',
			title: 'Type',
			value: (v: (typeof rows)[number]) => (v.paid ? 'Paid' : 'Free'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'deleteAmenities',
			title: '',
			renderComponent: {
				component: DeleteAmenitiesTable,
				props: {
					data: data,
					form: form,
				},
			},
			headerClass:
				'print:hidden text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'print:hidden text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
	])
</script>

<div>
	<div class="justify-between sm:flex">
		<div class="grid">
			<p class="text-2xl">Room Amenities</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_UNIT_AMENITIES')}
			<button
				type="submit"
				class="my-2 rounded-md bg-primary px-6 py-2 text-white md:my-0"
				onclick={() => (addModal = true)}
			>
				New Amenity</button
			>
		{/if}
	</div>
	<div class="-mx-6 overflow-y-auto pt-5">
		<SvelteTable
			classNameTable="unitAmenitiesTables"
			on:clickCell={(event) => {
				if (
					page.data.session?.authUser.Employee.Role.Scopes.find(
						(s) => s.name === 'EDIT_UNIT_AMENITIES',
					)
				) {
					selectedUnitId = event.detail.row.id
					editModal = true
				} else {
					toast.push('You do not have permission to edit amenities')
				}
			}}
			{columns}
			{rows}
		/>
	</div>
</div>

{#if addModal}
	<form use:addPropertyEnhance method="post" action="?/addAmenity">
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (addModal = false)}
				class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div>
					<p class="text-xl font-semibold">New Property</p>
					<p class="pt-2 text-sm text-subtitle">
						Register new room property here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="font-medium text-primary"> Amenity's Name </span>
					<input
						name="name"
						required
						bind:value={$addAmenityForm.name}
						{...$constraints.name}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Description </span>
					<textarea
						name="description"
						required
						bind:value={$addAmenityForm.description}
						{...$constraints.description}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					></textarea>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="paid"
						bind:checked={$addAmenityForm.paid}
						{...$constraints.paid}
						class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
					/>
					<span class="font-medium text-primary"> Paid Service </span>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Price </span>
					<input
						name="price"
						required
						bind:value={$addAmenityForm.price}
						{...$constraints.price}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					/>

					<button
						onclick={(e) => {
							e.stopPropagation()
						}}
						class="mt-6 rounded-md bg-primary py-2 text-white"
					>
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
			formData.set('amenityId', selectedUnitId?.toString() ?? '')
			return async ({ update }) => {
				await update()
				editModal = false
			}
		}}
		method="post"
		action="?/updateAmenity"
	>
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (editModal = false)}
				class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div>
					<p class="text-xl font-semibold">New Property</p>
					<p class="pt-2 text-sm text-subtitle">
						Register new room property here. Click save when you're done.
					</p>
				</div>
				<label class="grid">
					<span class="font-medium text-primary"> Amenity's Name </span>
					<input
						name="name"
						required
						value={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)?.name}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Description </span>
					<textarea
						name="description"
						required
						value={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)
							?.description}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					></textarea>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="paid"
						checked={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)?.paid}
						class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
					/>
					<span class="font-medium text-primary"> Paid Service </span>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Price </span>
					<input
						name="price"
						required
						value={data.unitDetails?.Amenities.find((item) => item.id === selectedUnitId)?.price}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					/>

					<button
						onclick={(e) => {
							e.stopPropagation()
						}}
						class="mt-6 rounded-md bg-primary py-2 text-white"
					>
						Update Amenity</button
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

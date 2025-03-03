<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte'
	import PdfPrint from '$lib/components/pdf-print.svelte'
	import { clickOutside } from '$lib/utils/click-outside'
	import { superForm } from 'sveltekit-superforms/client'
	import type { ActionData, PageData } from './$types'
	import PropertiesTable from './properties-table.svelte'

	let addModal = $state(false)

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data = $bindable(), form = $bindable() }: Props = $props()

	const {
		form: addPropertyForm,
		enhance: addPropertyEnhance,
		constraints,
	} = superForm(data.addPropertyForm, {
		onSubmit: () => {
			addModal = false
		},
	})
	let filterModal = $state(false)
	let urlSearchParams = $derived(new URLSearchParams(page.url.search))
</script>

<div>
	<div class="justify-between md:flex">
		<div class="grid">
			<p class="text-2xl">Room Properties</p>
		</div>
		{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_UNIT_PROPERTY')}
			<button
				type="submit"
				class="my-3 rounded-md bg-primary px-6 py-2 text-white md:my-0"
				onclick={() => (addModal = true)}
			>
				New Property</button
			>
		{/if}
	</div>
	<div class="">
		<div class="flex gap-3">
			<button
				class="grid grid-flow-col items-center gap-2 rounded-md border-[1px] border-black/20 bg-white px-4 py-2 text-sm shadow-md"
				onclick={() => (filterModal = !filterModal)}
			>
				<FiltersLines class="h-4 w-4" /> Add filters
			</button>
			<span class=" flex items-center">
				{urlSearchParams.get('propertyCondition')
					? urlSearchParams.get('propertyCondition')?.replace(/_/g, ' ')
					: ''}
			</span>
			<span class=" flex items-center">
				{urlSearchParams.get('propertyAvailability') === 'true'
					? 'AVAILABLE'
					: urlSearchParams.get('propertyAvailability') === 'false'
						? 'NOT AVAILABLE'
						: ''}
			</span>
		</div>

		{#if filterModal}
			<div class="fixed z-50 mt-4">
				<div
					use:clickOutside={() => (filterModal = false)}
					class="grid justify-items-start gap-4 rounded-xl border-[1px] border-black/20 bg-white p-6 shadow-md"
				>
					<button
						onclick={async () => {
							await goto(`?`)
						}}
						class="hover:text-primary hover:underline"
					>
						All
					</button>

					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('propertyCondition', 'DAMAGED')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Damaged
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('propertyCondition', 'NEEDS_REPAIR')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Needs Repair
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('propertyCondition', 'MISSING_ITEMS')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Missing Items
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('propertyCondition', 'GOOD_CONDITION')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Good Condition
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('propertyAvailability', 'true')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Available
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams(page.url.search)
							newSearchParams.set('propertyAvailability', 'false')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Not Available
					</button>
				</div>
			</div>
		{/if}
	</div>
	<div class="-mx-6 pt-5">
		<PdfPrint class="mx-6">
			<div class="">
				{#if data.unitDetails?.unitType === 'RESIDENTIAL'}
					<PropertiesTable {data} {form} itemCategory="SALON" />
					<PropertiesTable {data} {form} itemCategory="LAUNDRY" />
					<PropertiesTable {data} {form} itemCategory="KITCHEN" />
					<PropertiesTable {data} {form} itemCategory="BEDROOM" />
					<PropertiesTable {data} {form} itemCategory="BATHROOM" />
				{:else}
					<PropertiesTable {data} {form} itemCategory="COMMERCIAL" />
				{/if}
			</div>
			<div class="hidden p-8 print:block">
				<p class="text-lg font-semibold">Attention</p>
				<p class="text-sm">
					I, [____________________________________], acknowledge that I have received and carefully
					reviewed the attached inventory list, detailing the furnishings and equipment within the
					room I am renting. I confirm that all items are present and in good condition upon my
					arrival. I understand that I am responsible for the safekeeping and proper use of all
					listed items throughout my stay. I agree to pay the full replacement cost for any damage
					or loss to the listed items caused by me or my guests, beyond normal wear and tear. This
					includes, but is not limited to, spills, stains, breakage, rips, burns, or missing
					equipment. By signing below, I acknowledge my understanding and acceptance of this clause.
				</p>
			</div>
			<div class="hidden print:block">
				<p class="mt-2 pl-6 text-xl font-semibold">Sign here</p>
				<p class="mt-2 pl-8"><span> Name: </span> _________________________________</p>
				<p class="mt-2 pl-8"><span> Date: </span> _________________________________</p>

				<p class="ml-8 mt-2 border-[1px] border-black pb-1 pl-2 pt-10">
					<span> Signature: </span> _________________________________
				</p>
			</div>
		</PdfPrint>
	</div>
</div>

{#if addModal}
	<form use:addPropertyEnhance method="post" action="?/addProperty">
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
					<span class="font-medium text-primary"> Item's Name </span>
					<input
						name="name"
						required
						bind:value={$addPropertyForm.name}
						{...$constraints.name}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="available"
						bind:checked={$addPropertyForm.available}
						{...$constraints.available}
						class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
					/>
					<span class="font-medium text-primary"> Available now </span>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Description </span>
					<textarea
						name="description"
						required
						bind:value={$addPropertyForm.description}
						{...$constraints.description}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					></textarea>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Category </span>
					<select
						required
						name="itemCategory"
						bind:value={$addPropertyForm.itemCategory}
						{...$constraints.itemCategory}
						class=" rounded-md border-[1px] border-black/60 p-2"
					>
						<option selected disabled value=""> Item Category </option>
						<option value="SALON"> Salon </option>
						<option value="KITCHEN"> Kitchen </option>
						<option value="BATHROOM"> Bathroom </option>
						<option value="BEDROOM"> Bedroom </option>
						<option value="LAUNDRY"> Laundry </option>
						<option value="COMMERCIAL"> Commercial </option>
					</select>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Number of the Item </span>
					<input
						name="numberofUnits"
						required
						bind:value={$addPropertyForm.numberofUnits}
						{...$constraints.numberofUnits}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Full Price </span>
					<input
						name="price"
						required
						bind:value={$addPropertyForm.price}
						{...$constraints.price}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					/>
				</label>
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						name="inBirr"
						bind:checked={$addPropertyForm.inBirr}
						{...$constraints.inBirr}
						class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
					/>
					<span class="font-medium text-primary"> In Birr </span>
				</label>
				<label class="grid">
					<span class="font-medium text-primary"> Property Status </span>
					<select
						name="propertyStatus"
						required
						bind:value={$addPropertyForm.propertyStatus}
						{...$constraints.propertyStatus}
						class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-3"
					>
						<option selected disabled>Select Status</option>
						<option value="DAMAGED">Damaged</option>
						<option value="NEEDS_REPAIR">Needs Repair</option>
						<option value="MISSING_ITEMS">Missing Items</option>
						<option value="GOOD_CONDITION">Good Condition</option>
					</select>
				</label>

				<button
					onclick={(e) => {
						e.stopPropagation()
					}}
					class="mt-6 rounded-md bg-primary py-2 text-white"
				>
					Save Item</button
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

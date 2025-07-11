<script lang="ts">
	import FiltersLines from '$lib/assets/filters-lines.svg.svelte'
	import { toast } from '@zerodevx/svelte-toast'

	import { page } from '$app/stores'
	import UnitTableDeleteButton from './unit-table-delete-button.svelte'
	import SvelteTable from 'svelte-table'
	import { goto } from '$app/navigation'
	import InspectionStatusTable from './inspection-status-table.svelte'
	import { numberToCurrency } from '$lib/utils/currency'
	import { clickOutside } from '$lib/utils/click-outside'

	let { data } = $props()

	let filterModal = $state(false)

	let rows = $derived(data.units)
	let columns = $derived([
		{
			key: 'roomNo',
			title: 'Room Number',
			value: (v: (typeof rows)[number]) => v.roomNumber ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'floor',
			title: 'Floor',
			value: (v: (typeof rows)[number]) => v.floor ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'status',
			title: 'Status',
			value: (v: (typeof rows)[number]) => (v.active ? 'Occupied' : 'Vacant'),
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'condition',
			title: 'Condition',
			renderComponent: {
				component: InspectionStatusTable,
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8]  text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8] ',
		},
		{
			key: 'unitType',
			title: 'Unit Type',
			value: (v: (typeof rows)[number]) => v.unitType ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'size',
			title: 'Size',
			value: (v: (typeof rows)[number]) => v.kareMeter ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},

		{
			key: 'price',
			title: 'Price per Month',
			value: (v: (typeof rows)[number]) =>
				numberToCurrency(v.priceSetPerKare ? v.price * v.kareMeter : v.price, {
					currency: v.currency,
					currencyDisplay: 'code',
				}) ?? 'NOT FOUND',
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
		{
			key: 'second',
			title: '',
			renderComponent: {
				component: UnitTableDeleteButton,
				props: {
					data: data,
				},
			},
			headerClass:
				'text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12',
			class: 'text-sm text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]',
		},
	])

	let urlSearchParams = $derived(new URLSearchParams($page.url.search))
</script>

<div class="mx-10 my-12 rounded-sm border-[1px] border-black/20 bg-white shadow-md">
	<div class="justify-between p-6 sm:flex">
		<div class="flex space-x-4">
			<p class="text-lg">Rental Units</p>
			<p class="h-fit w-fit rounded-xl bg-[#F9F5FF] p-2 text-xs">{data.units.length} Units</p>
		</div>
		{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_RENTAL_UNIT')}
			<a href="/rental-units/add-unit" class="rounded-md bg-primary px-6 py-2 pt-2 text-white">
				New Rental Unit</a
			>
		{/if}
	</div>
	<div class="flex justify-between bg-ghost/60 p-6">
		<div class="flex gap-3">
			<button
				class="grid grid-flow-col items-center gap-2 rounded-md bg-white px-4 py-2 text-sm shadow-md"
				onclick={() => (filterModal = !filterModal)}
			>
				<FiltersLines class="h-4 w-4" /> Add filters
			</button>
			<span class=" flex items-center">
				{urlSearchParams.get('condition')
					? urlSearchParams.get('condition')?.replace(/_/g, ' ')
					: ''}
			</span>
			<span class=" flex items-center">
				{urlSearchParams.get('status') === 'vacant'
					? 'VACANT'
					: urlSearchParams.get('status') === 'occupied'
						? 'OCCUPIED'
						: ''}
			</span>
			<span class=" flex items-center">
				{urlSearchParams.get('unitType') ? urlSearchParams.get('unitType') : ''}
			</span>
		</div>

		<label class="grid gap-2">
			<input
				placeholder="Search"
				class=" rounded-md border-[1px] border-black/60 p-2"
				type="search"
				id="search"
				name="search"
				onchange={async (e) => {
					const newSearchParams = new URLSearchParams($page.url.search)
					newSearchParams.set('search', e.currentTarget.value)
					await goto(`?${newSearchParams.toString()}`)
				}}
			/>
		</label>
		{#if filterModal}
			<div class="fixed z-50 mt-12">
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
							const newSearchParams = new URLSearchParams($page.url.search)
							newSearchParams.set('condition', 'GOOD_CONDITION')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Good Condition
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams($page.url.search)
							newSearchParams.set('condition', 'NEEDS_REPAIR')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Needs Repair
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams($page.url.search)
							newSearchParams.set('condition', 'OUT_OF_SERVICE')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Out of Service
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams($page.url.search)
							newSearchParams.set('status', 'vacant')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Vacant
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams($page.url.search)
							newSearchParams.set('status', 'occupied')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Occupied
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams($page.url.search)
							newSearchParams.set('unitType', 'COMMERCIAL')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Commercial
					</button>
					<button
						onclick={async () => {
							const newSearchParams = new URLSearchParams($page.url.search)
							newSearchParams.set('unitType', 'RESIDENTIAL')
							await goto(`?${newSearchParams.toString()}`)
						}}
						class="hover:text-primary hover:underline"
					>
						Residential</button
					>
				</div>
			</div>
		{/if}
	</div>
	<div class="overflow-x-auto">
		<SvelteTable
			classNameTable="rolesTable"
			on:clickCell={(event) => {
				const unitId = event.detail.row.id

				if (
					$page.data.session?.authUser.Employee.Role.Scopes.find(
						(s) => s.name === 'VIEW_RENTAL_UNIT_DETAIL_PAGE',
					)
				) {
					goto(`/rental-units/${unitId}`)
				} else {
					toast.push('You do not have permission to view this page')
				}
			}}
			{columns}
			{rows}
		/>
	</div>
</div>

<style lang="postcss">
	* :global(.rolesTable) {
		@apply cursor-pointer;
	}
</style>

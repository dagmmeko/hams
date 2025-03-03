<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { numberToCurrency } from '$lib/utils/currency.js'
	import { toast } from '@zerodevx/svelte-toast'
	import { superForm } from 'sveltekit-superforms/client'
	let { data, form } = $props()

	let selectedUnit: any = $state()
	let selectedTenant: any = $state()
	let id: number | undefined = $state()

	const {
		form: rentRoomForm,
		enhance: rentRoomEnhance,
		constraints,
	} = superForm(data.rentRoomForm, {
		onSubmit: ({ formData }) => {
			formData.set('selectedTenantId', selectedTenant)
			formData.set('selectedUnitId', selectedUnit)
		},
	})

	let dateInput: any = $state()
	let dateInput2: any = $state()
	let unitData: any = $derived(data.rentalUnits.find((unit) => unit.id === Number(selectedUnit)))

	$effect.pre(() => {
		form?.rentTenant ? goto(`/tenants/${form.rentTenant.id}?display=receipts`) : null
	})
	$effect.pre(() => {
		form?.rentTenant ? toast.push('Tenant Rented') : null
	})
	let urlParam: any = $derived(page.url.searchParams.get('searchTenant'))
</script>

<div class="mx-5 mt-6 md:mx-10">
	<div class=" mt-6 rounded-md border-[1px] border-black/20 bg-white p-6 shadow-sm">
		<p class="text-xs text-black/50">Tenants / Rent Room</p>
		<div class="">
			<p class="text-2xl font-medium">Rent Room</p>
			<p class="py-2 text-sm">
				Find the tenant and select. Assign room and click save when you're done.
			</p>
		</div>
		<div class="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
			<label class="grid w-full">
				<span class="font-medium text-primary"> Tenant </span>

				<input
					placeholder="Search"
					class="mt-1 rounded-md border-[1px] border-black/60 p-2"
					type="search"
					id="search"
					name="search"
					onchange={async (e) => {
						const newSearchParams = new URLSearchParams(page.url.search)
						newSearchParams.set('searchTenant', e.currentTarget.value)
						await goto(`?${newSearchParams.toString()}`)
					}}
					value={urlParam}
				/>
			</label>
			<label class="grid w-full">
				<span class="font-medium text-primary"> Available Units </span>
				<select
					required
					onchange={(e) => {
						selectedUnit = e.currentTarget.value
					}}
					name="rentalUnitsId"
					bind:value={id}
					class="mt-1 rounded-md border-[1px] border-black/60 p-2"
				>
					<!-- {...$constraints.rentalUnitsId} -->

					<option selected disabled> Pick a Type </option>
					{#each data.rentalUnits as unit}
						<option value={unit.id}> {unit.roomNumber} </option>
					{/each}
				</select>
			</label>
		</div>
		<form use:rentRoomEnhance method="post" action="?/rentRoom">
			<div class="grid grid-cols-1 gap-10 sm:grid-cols-2">
				<div class="w-full">
					{#if data.tenants && data.tenants?.length !== 0}
						<div
							class="mt-2 h-44 overflow-hidden overflow-y-scroll rounded-md border-[1px] border-black/20 p-4"
						>
							{#each data.tenants as tenant}
								<button class="w-full" onclick={() => (selectedTenant = tenant.id)}>
									<div
										class=" {selectedTenant === tenant.id
											? 'bg-primary/20 '
											: 'bg-white'} mb-2 rounded-md border-[1px] border-black/20 px-4 py-2 text-start shadow-md"
									>
										<div class="font-medium">
											{tenant.fullName}
											<!-- <span class="font-light"> {tenant.companyName} </span> -->
										</div>
										<div></div>
										<div>{tenant.phoneNumber}</div>
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<div class="w-full">
					{#if selectedUnit}
						<div class="mt-2 rounded-md bg-slate-100 p-3">
							<label class="flex items-center gap-2">
								<input
									bind:checked={$rentRoomForm.priceChange}
									{...$constraints.priceChange}
									type="checkbox"
									name="priceChange"
									class="h-5 w-5"
								/>
								<span class="text-lg font-medium text-primary"> Request Price change </span>
							</label>
							<p class="black/50 text-xs">
								If you change the price, it will notify the right personnel for approval.
							</p>
							<label class="mt-4 grid gap-2">
								<p class="grid">
									<span class="font-medium text-primary">
										Current Price <span class="text-xs font-medium text-danger">
											{data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
												?.priceSetPerKare
												? 'Price Per m2'
												: ''}
										</span>
									</span>
									<span class="text-sm font-normal">
										{numberToCurrency(
											data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)?.price ??
												0,
											{
												currency:
													data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
														?.currency === 'USD'
														? 'USD'
														: 'ETB',
												currencyDisplay: 'code',
											},
										)}
									</span>
								</p>
								<input
									class="w-full rounded-md border-[1px] border-black/60 p-2"
									name="newPrice"
									type="number"
									placeholder="Amended Price"
									bind:value={$rentRoomForm.newPrice}
									required={$rentRoomForm.priceChange}
									{...$constraints.newPrice}
								/>
							</label>
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-10 grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
				<label class="grid gap-1">
					<span class="font-medium text-primary">
						Purpose of Rent <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						required
						name="purposeOfRent"
						bind:value={$rentRoomForm.purposeOfRent}
						{...$constraints.purposeOfRent}
					/>
				</label>
				<label class="grid gap-1">
					<span class="font-medium text-primary"> Company Name </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="companyName"
						bind:value={$rentRoomForm.companyName}
						{...$constraints.companyName}
					/>
				</label>
				<label class="grid gap-1">
					<span class="font-medium text-primary">
						Start Date <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						type="date"
						name="startDate"
						class="rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
						bind:value={$rentRoomForm.startDate}
						{...$constraints.startDate}
						required
					/>
				</label>
				<label class="grid gap-1">
					<span class="font-medium text-primary">
						End Date <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						type="date"
						name="endDate"
						class="rounded-md border-[1px] border-black/60 p-2"
						bind:this={dateInput2}
						onclick={() => {
							dateInput2 && dateInput2.showPicker()
						}}
						bind:value={$rentRoomForm.endDate}
						{...$constraints.endDate}
						required
					/>
				</label>

				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> TIN Number </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="tinNumber"
						bind:value={$rentRoomForm.tinNumber}
						{...$constraints.tinNumber}
					/>
				</label>
				<label class="grid gap-1">
					<span class="font-medium text-primary"> Duration of stay (in days) </span>
					<input
						bind:value={$rentRoomForm.duration}
						{...$constraints.duration}
						class="rounded-md border-[1px] border-black/60 p-2"
						name="duration"
						type="number"
					/>
				</label>

				<label class="grid w-full gap-2">
					<span class=" w-full font-medium text-primary"> Security Deposit</span>
					<input
						name="securityDeposit"
						type="number"
						class=" rounded-md border-[1px] border-black/60 p-2"
						bind:value={$rentRoomForm.securityDeposit}
						{...$constraints.securityDeposit}
					/>
				</label>
				<div></div>
				<button class="mt-6 h-fit rounded-md bg-primary px-6 py-2 text-white"> Rent Room</button>
			</div>
		</form>
	</div>
</div>

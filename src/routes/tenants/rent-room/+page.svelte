<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { numberToCurrency } from '$lib/utils/currency.js';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	export let form;

	let selectedUnit: any;
	let selectedTenant: any;
	let id: number;

	const {
		form: rentRoomForm,
		enhance: rentRoomEnhance,
		constraints
	} = superForm(data.rentRoomForm, {
		onSubmit: ({ formData }) => {
			formData.set('selectedTenantId', selectedTenant);
			formData.set('selectedUnitId', selectedUnit);
		}
	});

	let dateInput: any;
	let dateInput2: any;
	let unitData: any;
	$: {
		unitData = data.rentalUnits.find((unit) => unit.id === Number(selectedUnit));
	}

	$: form?.rentTenant ? goto('/tenants') : null;
	$: form?.rentTenant ? toast.push('Tenant Rented') : null;
	let urlParam: any;
	$: urlParam = $page.url.searchParams.get('searchTenant');
</script>

<div class="mt-6 md:mx-10 mx-5">
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<p class="text-xs text-black/50">Tenants / Rent Room</p>
		<div class="">
			<p class="text-2xl font-medium">Rent Room</p>
			<p class="text-sm py-2">
				Find the tenant and select. Assign room and click save when you're done.
			</p>
		</div>
		<div class="grid sm:grid-cols-2 grid-cols-1 gap-10 mt-6">
			<label class="grid w-full">
				<span class="text-primary font-medium"> Tenant </span>

				<input
					placeholder="Search"
					class="border-[1px] mt-1 border-black/60 rounded-md p-2"
					type="search"
					id="search"
					name="search"
					on:change={async (e) => {
						const newSearchParams = new URLSearchParams($page.url.search);
						newSearchParams.set('searchTenant', e.currentTarget.value);
						await goto(`?${newSearchParams.toString()}`);
					}}
					value={urlParam}
				/>
			</label>
			<label class="grid w-full">
				<span class="text-primary font-medium"> Available Units </span>
				<select
					required
					on:change={(e) => {
						selectedUnit = e.currentTarget.value;
					}}
					name="rentalUnitsId"
					bind:value={id}
					class="mt-1 border-[1px] border-black/60 rounded-md p-2"
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
			<div class="grid sm:grid-cols-2 grid-cols-1 gap-10">
				<div class="w-full">
					{#if data.tenants && data.tenants?.length !== 0}
						<div
							class="h-44 overflow-hidden overflow-y-scroll mt-2 border-[1px] border-black/20 p-4 rounded-md"
						>
							{#each data.tenants as tenant}
								<button class="w-full" on:click={() => (selectedTenant = tenant.id)}>
									<div
										class=" {selectedTenant === tenant.id
											? 'bg-primary/20 '
											: 'bg-white'} text-start rounded-md mb-2 shadow-md px-4 py-2 border-[1px] border-black/20"
									>
										<div class="font-medium">
											{tenant.fullName}
											<!-- <span class="font-light"> {tenant.companyName} </span> -->
										</div>
										<div />
										<div>{tenant.phoneNumber}</div>
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<div class="w-full">
					{#if selectedUnit}
						<div class="bg-slate-100 p-3 mt-2 rounded-md">
							<label class="flex items-center gap-2">
								<input
									bind:checked={$rentRoomForm.priceChange}
									{...$constraints.priceChange}
									type="checkbox"
									name="priceChange"
									class="h-5 w-5"
								/>
								<span class="text-primary font-medium text-lg"> Request Price change </span>
							</label>
							<p class="text-xs black/50">
								If you change the price, it will notify the right personnel for approval.
							</p>
							<label class="grid gap-2 mt-4">
								<p class="grid">
									<span class="text-primary font-medium">
										Current Price <span class="text-danger text-xs font-medium">
											{data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
												?.priceSetPerKare
												? 'Price Per m2'
												: ''}
										</span>
									</span>
									<span class="font-normal text-sm">
										{numberToCurrency(
											data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)?.price ??
												0,
											{
												currency:
													data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
														?.currency === 'USD'
														? 'USD'
														: 'ETB',
												currencyDisplay: 'code'
											}
										)}
									</span>
								</p>
								<input
									class="w-full border-[1px] border-black/60 rounded-md p-2"
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

			<div class="grid sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-4 mt-10">
				<label class="grid gap-1">
					<span class="text-primary font-medium">
						Purpose of Rent <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						required
						name="purposeOfRent"
						bind:value={$rentRoomForm.purposeOfRent}
						{...$constraints.purposeOfRent}
					/>
				</label>
				<label class="grid gap-1">
					<span class="text-primary font-medium"> Company Name </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="companyName"
						bind:value={$rentRoomForm.companyName}
						{...$constraints.companyName}
					/>
				</label>
				<label class="grid gap-1">
					<span class="text-primary font-medium">
						Start Date <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						type="date"
						name="startDate"
						class="border-[1px] border-black/60 rounded-md p-2"
						bind:this={dateInput}
						on:click={() => {
							dateInput && dateInput.showPicker();
						}}
						bind:value={$rentRoomForm.startDate}
						{...$constraints.startDate}
						required
					/>
				</label>
				<label class="grid gap-1">
					<span class="text-primary font-medium">
						End Date <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						type="date"
						name="endDate"
						class="border-[1px] border-black/60 rounded-md p-2"
						bind:this={dateInput2}
						on:click={() => {
							dateInput2 && dateInput2.showPicker();
						}}
						bind:value={$rentRoomForm.endDate}
						{...$constraints.endDate}
						required
					/>
				</label>

				<label class="w-full grid gap-2">
					<span class="text-primary font-medium"> TIN Number </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="tinNumber"
						bind:value={$rentRoomForm.tinNumber}
						{...$constraints.tinNumber}
					/>
				</label>
				<label class="grid gap-1">
					<span class="text-primary font-medium"> Duration of stay </span>
					<input
						bind:value={$rentRoomForm.duration}
						{...$constraints.duration}
						class="border-[1px] border-black/60 rounded-md p-2"
						name="duration"
						type="number"
					/>
				</label>

				<label class="w-full grid gap-2">
					<span class=" text-primary w-full font-medium"> Security Deposit</span>
					<input
						name="securityDeposit"
						type="number"
						class=" border-[1px] border-black/60 rounded-md p-2"
						bind:value={$rentRoomForm.securityDeposit}
						{...$constraints.securityDeposit}
					/>
				</label>
				<div />
				<button class="bg-primary text-white rounded-md py-2 px-6 h-fit mt-6"> Rent Room</button>
			</div>
		</form>
	</div>
</div>

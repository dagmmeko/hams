<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	export let data;
	export let form;
	let selectedUnit: any;
	let selectedTenant: any;
	let id: number;

	let dateInput: any;
	let dateInput2: any;
	let unitData: any;
	$: {
		unitData = data.rentalUnits.find((unit) => unit.id === Number(selectedUnit));
	}

	$: form?.rentTenant ? goto('/tenants') : null;
	$: form?.rentTenant ? toast.push('Tenant Rented') : null;
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Tenants / Rent Room</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<form
			use:enhance={({ formData }) => {
				formData.set('selectedTenantId', selectedTenant);
				formData.set('selectedUnitId', selectedUnit);
			}}
			method="post"
			action="?/rentRoom"
		>
			<div class="grid grid-cols-2 mb-6">
				<div class="">
					<p class="text-2xl font-medium">Rent Room</p>
					<p class="text-sm py-2">
						Find the tenant and select. Assign room and click save when you're done.
					</p>
					<button class="bg-primary text-white rounded-md py-2 px-6 w-[420px] mt-6">
						Rent Room</button
					>
				</div>
				<div>
					{#if selectedUnit}
						<div class="bg-slate-100 p-3 w-[420px]">
							<label class="flex items-center gap-2">
								<input type="checkbox" name="priceChange" class="h-5 w-5" />
								<span class="text-primary font-medium text-lg"> Request Price change </span>
							</label>
							<p class="text-xs black/50">
								If you change the price, it will notify the right personnel for approval.
							</p>
							<label class="grid gap-2 mt-4">
								<p class="grid">
									<span class="text-primary font-medium">Current Price</span>
									<span class="font-normal text-sm">
										{data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)?.price} Birr
									</span>
								</p>
								<input
									class="w-full border-[1px] border-black/60 rounded-md p-2"
									name="newPrice"
									type="number"
									placeholder="Amended Price"
								/>
							</label>
						</div>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-2">
				<div class="grid gap-4">
					<label class="grid gap-2">
						<span class="text-primary font-medium"> Purpose of Rent </span>
						<input
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
							required
							name="purposeOfRent"
						/>
					</label>

					<label class="grid">
						<span class="text-primary font-medium"> Contract Start Date </span>
						<input
							type="date"
							name="startDate"
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
							bind:this={dateInput}
							on:click={() => {
								dateInput && dateInput.showPicker();
							}}
						/>
					</label>

					<label class="grid">
						<span class="text-primary font-medium"> Tenant </span>

						<input
							placeholder="Search"
							class="w-[420px] border-[1px] mt-1 border-black/60 rounded-md p-2"
							type="search"
							id="search"
							name="search"
							on:change={async (e) => {
								const newSearchParams = new URLSearchParams($page.url.search);
								newSearchParams.set('searchTenant', e.currentTarget.value);
								await goto(`?${newSearchParams.toString()}`);
							}}
						/>
					</label>
				</div>
				<div class="grid gap-4">
					<label class="grid gap-2">
						<span class="text-primary font-medium"> Duration of stay </span>
						<input
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
							required
							name="duration"
						/>
					</label>
					<label class="grid">
						<span class="text-primary font-medium"> End Date </span>
						<input
							type="date"
							name="endDate"
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
							bind:this={dateInput2}
							on:click={() => {
								dateInput2 && dateInput2.showPicker();
							}}
						/>
					</label>
					<label class="grid">
						<span class="text-primary font-medium"> Available Units </span>
						<select
							required
							on:change={(e) => {
								selectedUnit = e.currentTarget.value;
							}}
							name="rentalUnitsId"
							bind:value={id}
							class=" w-[420px] mt-1 border-[1px] border-black/60 rounded-md p-2"
						>
							<!-- {...$constraints.rentalUnitsId} -->

							<option selected disabled> Pick a Type </option>
							{#each data.rentalUnits as unit}
								<option value={unit.id}> {unit.roomNumber} </option>
							{/each}
						</select>
					</label>
				</div>
			</div>
		</form>
	</div>
	<div class="grid grid-cols-2">
		<div>
			{#if data.tenants}
				{#each data.tenants as tenant}
					<button on:click={() => (selectedTenant = tenant.id)}>
						<div
							class=" {selectedTenant === tenant.id
								? 'bg-primary/20 '
								: 'bg-white'} grid text-start p-6 w-[444px] mt-6 rounded-md shadow-sm border-[1px] border-black/20"
						>
							<div><span class="font-semibold">Name:</span> {tenant.fullName}</div>
							<div><span class="font-semibold">Email:</span> {tenant.email}</div>
							<div><span class="font-semibold">Phone:</span> {tenant.phoneNumber}</div>
							<div><span class="font-semibold">Score:</span> {tenant.tenantScore}</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
		<div>
			{#if selectedUnit}<div
					class=" bg-primary/20 p-6 w-[424px] mt-6 rounded-md shadow-sm border-[1px] border-black/20"
				>
					<div><span class="font-semibold">Room No:</span>{unitData.roomNumber}</div>
					<div><span class="font-semibold">Price:</span>{unitData.price}</div>
					<div><span class="font-semibold">Min Date:</span>{unitData.minimumRentalDate}</div>
					<div><span class="font-semibold">Max Tenant:</span>{unitData.maximumTenants}</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let data;
	let selectedUnit: any;
	let selectedTenant: any;
	let id: number;

	let unitData: any;
	$: {
		unitData = data.rentalUnits.find((unit) => unit.id === Number(selectedUnit));
	}
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Tenants / Rent Room</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<div class="">
			<p class="text-2xl font-medium">Rent Room</p>
			<p class="text-sm py-2">
				Find the tenant and select. Assign room and click save when you're done.
			</p>
		</div>
		<div class="mt-6 grid grid-cols-2">
			<div>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Full Name </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="fullName"
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
			<div>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Full Name </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="fullName"
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
	</div>
	<div class="grid grid-cols-2">
		<div>
			{#if data.tenants}
				{#each data.tenants as tenant}
					<button on:click={() => (selectedTenant = tenant)}>
						<div
							class=" {selectedTenant?.id === tenant.id
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

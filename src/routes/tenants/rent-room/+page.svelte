<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	export let data;
	let selectedUnit: any;
	let id: number;
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
		<div class=" bg-white w-[444px] p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
			{#if data.tenants}
				{#each data.tenants as tenant}
					{tenant.fullName}
				{/each}
			{/if}
		</div>
		<div class=" bg-white p-6 w-[424px] mt-6 rounded-md shadow-sm border-[1px] border-black/20">
			{#if data.tenants}
				{#each data.tenants as tenant}
					{tenant.fullName}
				{/each}
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	import QR from '$lib/assets/qr.png';

	const {
		form: addTenantForm,
		enhance: addTenantEnhance,
		constraints
	} = superForm(data.addTenantForm);
	let dateInput: any;
	let dateInput2: any;

	let selectedUnit: any;
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Tenants / New Tenants</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<div class="">
			<p class="text-2xl font-medium">New Tenant</p>
			<p class="text-sm py-2">Register new Tenant here. Click save when you're done.</p>
		</div>
		<form method="post" action="?/addTenant" use:addTenantEnhance class="mt-6">
			<div class="flex flex-wrap gap-x-20 my-6">
				<label class="grid gap-2 h-fit">
					<span class="text-primary font-medium"> Unit Type </span>
					<select
						required
						on:change={(e) => {
							selectedUnit = e.currentTarget.value;
						}}
						name="rentalUnitsId"
						bind:value={$addTenantForm.rentalUnitsId}
						{...$constraints.rentalUnitsId}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Pick a Type </option>
						{#each data.rentalUnits as unit}
							<option value={unit.id}> {unit.roomNumber} </option>
						{/each}
					</select>
				</label>
				<div>
					{#if selectedUnit}
						<div class="w-[420px]">
							<p class="font-semibold">
								Maximum Number of Tenants <span class="font-normal">
									{data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
										?.maximumTenants}
								</span>
							</p>
						</div>
						<div class="w-[420px]">
							<p class="font-semibold">
								Minimum Days of Rental <span class="font-normal">
									{data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
										?.minimumRentalDate}
								</span>
							</p>
						</div>
						<div class="bg-slate-100 p-3 w-[420px]">
							<label class="grid gap-2">
								<span class="text-primary font-medium"> Price </span>
								<p class="text-xs black/50">
									If you change the price, it will notify the right personnel for approval.
								</p>
								<input
									class="w-full border-[1px] border-black/60 rounded-md p-2"
									name="price"
									value={data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
										?.price}
								/>
							</label>
						</div>
					{/if}
				</div>
			</div>
			<hr />
			<div class="flex flex-wrap gap-x-20 my-6 gap-y-6">
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Full Name </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="fullName"
						bind:value={$addTenantForm.fullName}
						{...$constraints.fullName}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Phone Number </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="phoneNumber"
						bind:value={$addTenantForm.phoneNumber}
						{...$constraints.phoneNumber}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Email </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="email"
						bind:value={$addTenantForm.email}
						{...$constraints.email}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Purpose of rent </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="purposeOfRent"
						bind:value={$addTenantForm.purposeOfRent}
						{...$constraints.purposeOfRent}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Contract Start Date </span>
					<input
						type="date"
						name="contractStartDate"
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
						bind:this={dateInput}
						on:click={() => {
							dateInput && dateInput.showPicker();
						}}
						bind:value={$addTenantForm.contractStartDate}
						{...$constraints.contractStartDate}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Contract End Date </span>
					<input
						type="date"
						name="contractEndDate"
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
						bind:this={dateInput2}
						on:click={() => {
							dateInput2 && dateInput2.showPicker();
						}}
						bind:value={$addTenantForm.contractEndDate}
						{...$constraints.contractEndDate}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Duration of Stay In Country </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="price"
						bind:value={$addTenantForm.durationOfStayInCountry}
						{...$constraints.durationOfStayInCountry}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Emergency Contact Name </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="emergencyContactName"
						bind:value={$addTenantForm.emergencyContactName}
						{...$constraints.emergencyContactName}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Emergency Contact Email </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="emergencyContactEmail"
						bind:value={$addTenantForm.emergencyContactEmail}
						{...$constraints.emergencyContactEmail}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Emergency Contact Phone Number </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="emergencyContactPhoneNumber"
						bind:value={$addTenantForm.emergencyContactPhoneNumber}
						{...$constraints.emergencyContactPhoneNumber}
					/>
				</label>
				<label class="grid gap-2">
					<span class="text-primary font-medium"> Tenant Internal Score </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="tenantScore"
						bind:value={$addTenantForm.tenantScore}
						{...$constraints.tenantScore}
					/>
				</label>
			</div>
			<hr />
			<div class="text-2xl mt-6">
				Room Documents
				<img src={QR} alt="qr" />
			</div>
			<button class="bg-primary text-white rounded-md py-2 px-6 w-[420px] mt-6">
				Create Tenant</button
			>
		</form>
	</div>
</div>

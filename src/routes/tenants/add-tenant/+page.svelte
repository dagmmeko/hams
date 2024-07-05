<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import { numberToCurrency } from '$lib/utils/currency';
	import { uploadFiles } from '$lib/utils/upload-files';

	export let form;
	export let data;

	let filesSelected: File[] = [];

	const {
		form: addTenantForm,
		enhance: addTenantEnhance,
		constraints
	} = superForm(data.addTenantForm, {
		onSubmit: ({ formElement, formData }) => {
			formData.set('tenantFile', 'Tenant Files');
			filesSelected = formElement.tenantFile.files;
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				const uploadPromises = [];

				for (const file of filesSelected) {
					uploadPromises.push(
						(async function () {
							const uploadStatus = await uploadFiles(
								file,
								`tenantsFile/${result.data?.addTenant.id}/${file.name}`
							);
							if (uploadStatus) {
								const fileDataRes = await fetch('https://hams-one.vercel.app/api/postFileData', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										key: `tenantsFile/${result.data?.addTenant.id}/${file.name}`,
										fileName: file.name,
										type: 'tenants',
										id: result.data?.addTenant.id
									})
								});
								const fileData = await fileDataRes.json();
								if (fileData.type === 'ERROR') {
									toast.push(`Error writing file data for: ${file.name}`);
									return false;
								}
								return true;
							} else {
								toast.push(`Error uploading: ${file.name}`);
								return false;
							}
						})()
					);
				}
				const successes = await Promise.all(uploadPromises);

				if (!successes.find((s) => s !== true)) {
					toast.push('Tenant added successfully');
					setTimeout(() => {
						window.location.href = '/tenants';
					}, 1500);
				}
			}
		}
	});

	let dateInput: any;
	let dateInput2: any;

	let selectedUnit: any;
	let frontFileData: string[] = [];
</script>

<div class="mt-6 md:mx-10 mx-5">
	<p class="text-xs text-black/50">Tenants / New Tenants</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<div class="">
			<p class="text-2xl font-medium">New Tenant</p>
			<p class="text-sm py-2">Register new Tenant here. Click save when you're done.</p>
		</div>
		<form method="post" action="?/addTenant" use:addTenantEnhance class="mt-6">
			<div class="grid md:grid-cols-2 gap-x-10 my-6">
				<label class="grid w-full gap-2 h-fit">
					<span class="text-primary font-medium"> Unit Type </span>
					<select
						on:change={(e) => {
							selectedUnit = e.currentTarget.value;
						}}
						name="rentalUnitsId"
						bind:value={$addTenantForm.rentalUnitsId}
						{...$constraints.rentalUnitsId}
						class="mt-2 border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Pick a Type </option>
						{#each data.rentalUnits as unit}
							<option value={unit.id}> {unit.roomNumber} </option>
						{/each}
					</select>
				</label>
				<div class="w-full">
					{#if selectedUnit}
						<div class="w-full">
							<p class="font-semibold">
								Maximum Number of Tenants <span class="font-normal">
									{data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
										?.maximumTenants}
								</span>
							</p>
						</div>
						<div class="w-full">
							<p class="font-semibold">
								Minimum Days of Rental <span class="font-normal">
									{data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)
										?.minimumRentalDate}
								</span>
							</p>
						</div>
						<div class="bg-slate-100 p-3 w-full">
							<label class="flex items-center gap-2">
								<input
									bind:checked={$addTenantForm.priceChange}
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
									required={$addTenantForm.priceChange}
									bind:value={$addTenantForm.newPrice}
									{...$constraints.newPrice}
								/>
							</label>
						</div>
					{/if}
				</div>
			</div>
			<hr />
			<div class="grid md:grid-cols-2 gap-x-10 my-6 gap-y-6">
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium">
						Full Name <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="fullName"
						bind:value={$addTenantForm.fullName}
						{...$constraints.fullName}
					/>
				</label>
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium"> Company Name </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="companyName"
						bind:value={$addTenantForm.companyName}
						{...$constraints.companyName}
					/>
				</label>
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium">
						Phone Number <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="phoneNumber"
						bind:value={$addTenantForm.phoneNumber}
						{...$constraints.phoneNumber}
					/>
				</label>
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium"> Email </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="email"
						bind:value={$addTenantForm.email}
						{...$constraints.email}
					/>
				</label>
				<label class="w-full gap-2 grid">
					<span class="text-primary font-medium"> Booking Source </span>
					<select
						bind:value={$addTenantForm.contactSource}
						{...$constraints.contactSource}
						name="contactSource"
						class=" border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Select Type </option>
						<option value="WEBSITE"> Website </option>
						<option value="REFERRAL">Referral</option>
						<option value="WALK_IN">Walk in</option>
						<option value="EMAIL">Email</option>
						<option value="SOCIAL_MEDIA">Social Media</option>
						<option value="BROKER">Broker</option>
						<option value="OTHER">Other</option>
					</select>
				</label>
				{#if !$addTenantForm.priceChange}
					{#if data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)?.unitType !== 'COMMERCIAL'}
						<label class="w-full grid gap-2">
							<span class="text-primary font-medium"> Purpose of Visit </span>
							<input
								class=" border-[1px] border-black/60 rounded-md p-2"
								name="purposeOfRent"
								bind:value={$addTenantForm.purposeOfRent}
								{...$constraints.purposeOfRent}
							/>
						</label>
						<label class="w-full grid gap-2">
							<span class="text-primary font-medium"> Duration of Stay In Country </span>
							<input
								class=" border-[1px] border-black/60 rounded-md p-2"
								name="price"
								bind:value={$addTenantForm.durationOfStayInCountry}
								{...$constraints.durationOfStayInCountry}
							/>
						</label>
					{/if}

					<label class="grid gap-2">
						<span class="text-primary w-full font-medium"> Contract Start Date </span>
						<input
							type="date"
							name="contractStartDate"
							class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
							bind:this={dateInput}
							on:click={() => {
								dateInput && dateInput.showPicker();
							}}
							bind:value={$addTenantForm.contractStartDate}
							{...$constraints.contractStartDate}
						/>
					</label>

					<label class="grid gap-2">
						<span class="text-primary w-full font-medium"> Contract End Date </span>
						<input
							type="date"
							name="contractEndDate"
							class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
							bind:this={dateInput2}
							on:click={() => {
								dateInput2 && dateInput2.showPicker();
							}}
							bind:value={$addTenantForm.contractEndDate}
							{...$constraints.contractEndDate}
						/>
					</label>
					<label class="w-full grid gap-2">
						<span class=" text-primary w-full font-medium"> Security Deposit</span>
						<input
							name="securityDeposit"
							type="number"
							class=" border-[1px] border-black/60 rounded-md p-2"
							bind:value={$addTenantForm.securityDeposit}
							{...$constraints.securityDeposit}
						/>
					</label>
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium"> TIN Number </span>
						<input
							class=" border-[1px] border-black/60 rounded-md p-2"
							name="tinNumber"
							bind:value={$addTenantForm.tinNumber}
							{...$constraints.tinNumber}
						/>
					</label>
				{/if}
				{#if data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)?.unitType !== 'COMMERCIAL'}
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium">
							Passport Number <span class="text-xs font-light text-danger">
								* Required for Foreign Customers
							</span></span
						>
						<input
							class=" border-[1px] border-black/60 rounded-md p-2"
							name="passportNumber"
							bind:value={$addTenantForm.passportNumber}
							{...$constraints.passportNumber}
						/>
					</label>
				{/if}
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium"> Emergency Contact Name </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="emergencyContactName"
						bind:value={$addTenantForm.emergencyContactName}
						{...$constraints.emergencyContactName}
					/>
				</label>
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium"> Emergency Contact Email </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						type="email"
						name="emergencyContactEmail"
						bind:value={$addTenantForm.emergencyContactEmail}
						{...$constraints.emergencyContactEmail}
					/>
				</label>
				<label class="w-full grid gap-2">
					<span class="text-primary font-medium"> Emergency Contact Phone Number </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						type="tel"
						name="emergencyContactPhoneNumber"
						bind:value={$addTenantForm.emergencyContactPhoneNumber}
						{...$constraints.emergencyContactPhoneNumber}
					/>
				</label>
				<!-- <label class="w-full grid gap-2">
					<span class="text-primary font-medium"> Tenant Internal Score </span>
					<input
						class=" border-[1px] border-black/60 rounded-md p-2"
						name="tenantScore"
						bind:value={$addTenantForm.tenantScore}
						{...$constraints.tenantScore}
					/>
				</label> -->
			</div>
			<hr class="my-4" />

			<label>
				<input
					class="hidden"
					type="file"
					name="tenantFile"
					multiple
					on:change={(e) => {
						const data = e.currentTarget.files;
						if (data) {
							for (let i = 0; i <= data?.length; i++) {
								if (data.item(i)) {
									frontFileData = [...frontFileData, data[i].name];
								}
							}
						}
					}}
				/>
				<div class=" flex-1 flex-shrink-0 grid grid-cols-4 items-start gap-2">
					{#each frontFileData as file}
						<div
							class="relative border-[1px] max-w-[180px] border-primary border-dashed rounded-lg gap-2 items-center justify-center"
						>
							<div class=" relative z-10 w-32 h-36" />

							<div class="absolute top-0 w-full h-full left-0 z-30">
								<div class="flex flex-col gap-2 justify-center items-center h-full">
									<FileUpload class="h-6 w-6 flex-shrink-0 ml-2 text-black" />
									<p class="text-sm ml-2 py-2">{file}</p>
									<button
										on:click|preventDefault={() => {
											// remove the file.id from the frontFileData array
											frontFileData = frontFileData.filter((res) => res !== file);
										}}>x</button
									>
								</div>
							</div>
						</div>
					{/each}
					<div
						class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"
					>
						<div class=" relative z-10 w-32 h-36" />
						<div class="absolute top-0 w-full h-full left-0 z-30">
							<div class="flex flex-col gap-2 justify-center items-center h-full">
								<FileUp class="text-primary w-7 h-7" />
								<span class="text-xs">Upload File</span>
								<p class="text-[10px] text-center px-3">
									For residential customers upload ID, License or Passport
								</p>
							</div>
						</div>
					</div>
				</div>
			</label>
			<hr class="my-6" />

			<button class="bg-primary text-white rounded-md py-2 px-6 w-[420px] mt-6">
				Create Tenant</button
			>
		</form>
	</div>
</div>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import { goto } from '$app/navigation'
	import { toast } from '@zerodevx/svelte-toast'
	import FileUpload from '$lib/assets/file-upload.svg.svelte'
	import FileUp from '$lib/assets/file-up.svg.svelte'
	import { numberToCurrency } from '$lib/utils/currency'
	import { uploadFiles } from '$lib/utils/upload-files'

	let { form, data } = $props()

	let filesSelected: File[] = []
	let fileUploading = false

	const {
		form: addTenantForm,
		enhance: addTenantEnhance,
		constraints,
	} = superForm(data.addTenantForm, {
		onSubmit: ({ formElement, formData }) => {
			formData.set('tenantFile', 'Tenant Files')
			filesSelected = formElement.tenantFile.files
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				fileUploading = true
				const uploadPromises = []

				for (const file of filesSelected) {
					uploadPromises.push(
						(async function () {
							const uploadStatus = await uploadFiles(
								file,
								`tenantsFile/${result.data?.addTenant.id}/${file.name}`,
							)
							if (uploadStatus) {
								const fileDataRes = await fetch('https://hams-one.vercel.app/api/postFileData', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										key: `tenantsFile/${result.data?.addTenant.id}/${file.name}`,
										fileName: file.name,
										type: 'tenants',
										id: result.data?.addTenant.id,
									}),
								})
								const fileData = await fileDataRes.json()
								if (fileData.type === 'ERROR') {
									toast.push(`Error writing file data for: ${file.name}`)
									return false
								}
								return true
							} else {
								toast.push(`Error uploading: ${file.name}`)
								return false
							}
						})(),
					)
				}
				const successes = await Promise.all(uploadPromises)

				console.log({ successes })

				if (!successes.find((s) => s !== true)) {
					toast.push('Tenant added successfully')
					fileUploading = false
					setTimeout(() => {
						window.location.href = `/tenants/${result.data?.addTenant.id}?display=receipts`
					}, 1500)
				}
			}
		},
	})

	let dateInput: any = $state()
	let dateInput2: any = $state()

	let selectedUnit: any = $state()
	let frontFileData: string[] = $state([])
</script>

<div class="mx-5 mt-6 md:mx-10">
	<p class="text-xs text-black/50">Tenants / New Tenants</p>
	<div class=" mt-6 rounded-md border-[1px] border-black/20 bg-white p-6 shadow-sm">
		<div class="">
			<p class="text-2xl font-medium">New Tenant</p>
			<p class="py-2 text-sm">Register new Tenant here. Click save when you're done.</p>
		</div>
		<form
			method="post"
			action="?/addTenant"
			use:addTenantEnhance
			class="mt-6"
			enctype="multipart/form-data"
		>
			<div class="my-6 grid gap-x-10 md:grid-cols-2">
				<label class="grid h-fit w-full gap-2">
					<span class="font-medium text-primary"> Unit Type </span>
					<select
						onchange={(e) => {
							selectedUnit = e.currentTarget.value
						}}
						name="rentalUnitsId"
						bind:value={$addTenantForm.rentalUnitsId}
						{...$constraints.rentalUnitsId}
						class="mt-2 rounded-md border-[1px] border-black/60 p-2"
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
						<div class="w-full bg-slate-100 p-3">
							<label class="flex items-center gap-2">
								<input
									bind:checked={$addTenantForm.priceChange}
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
			<div class="my-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary">
						Full Name <span class="text-xs font-light text-danger"> * Required </span></span
					>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="fullName"
						bind:value={$addTenantForm.fullName}
						{...$constraints.fullName}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Company Name </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="companyName"
						bind:value={$addTenantForm.companyName}
						{...$constraints.companyName}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary">
						Phone Number <span class="text-xs font-light text-danger"> * Required </span>
					</span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="phoneNumber"
						bind:value={$addTenantForm.phoneNumber}
						{...$constraints.phoneNumber}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Email </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="email"
						bind:value={$addTenantForm.email}
						{...$constraints.email}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Booking Source </span>
					<select
						bind:value={$addTenantForm.contactSource}
						{...$constraints.contactSource}
						name="contactSource"
						class=" rounded-md border-[1px] border-black/60 p-2"
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
						<label class="grid w-full gap-2">
							<span class="font-medium text-primary"> Purpose of Visit </span>
							<input
								class=" rounded-md border-[1px] border-black/60 p-2"
								name="purposeOfRent"
								bind:value={$addTenantForm.purposeOfRent}
								{...$constraints.purposeOfRent}
							/>
						</label>
						<label class="grid w-full gap-2">
							<span class="font-medium text-primary"> Duration of Stay In Country (in days) </span>
							<input
								class=" rounded-md border-[1px] border-black/60 p-2"
								name="price"
								type="number"
								bind:value={$addTenantForm.durationOfStayInCountry}
								{...$constraints.durationOfStayInCountry}
							/>
						</label>
					{/if}

					<label class="grid gap-2">
						<span class="w-full font-medium text-primary"> Contract Start Date </span>
						<input
							type="date"
							name="contractStartDate"
							class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
							bind:this={dateInput}
							onclick={() => {
								dateInput && dateInput.showPicker()
							}}
							bind:value={$addTenantForm.contractStartDate}
							{...$constraints.contractStartDate}
						/>
					</label>

					<label class="grid gap-2">
						<span class="w-full font-medium text-primary"> Contract End Date </span>
						<input
							type="date"
							name="contractEndDate"
							class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
							bind:this={dateInput2}
							onclick={() => {
								dateInput2 && dateInput2.showPicker()
							}}
							bind:value={$addTenantForm.contractEndDate}
							{...$constraints.contractEndDate}
						/>
					</label>
					<label class="grid w-full gap-2">
						<span class=" w-full font-medium text-primary"> Security Deposit</span>
						<input
							name="securityDeposit"
							type="number"
							class=" rounded-md border-[1px] border-black/60 p-2"
							bind:value={$addTenantForm.securityDeposit}
							{...$constraints.securityDeposit}
						/>
					</label>
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary"> TIN Number </span>
						<input
							class=" rounded-md border-[1px] border-black/60 p-2"
							name="tinNumber"
							bind:value={$addTenantForm.tinNumber}
							{...$constraints.tinNumber}
						/>
					</label>
				{/if}
				{#if data.rentalUnits.find((unit) => unit.id.toString() === selectedUnit)?.unitType !== 'COMMERCIAL'}
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary">
							Passport Number <span class="text-xs font-light text-danger">
								* Required for Foreign Customers
							</span></span
						>
						<input
							class=" rounded-md border-[1px] border-black/60 p-2"
							name="passportNumber"
							bind:value={$addTenantForm.passportNumber}
							{...$constraints.passportNumber}
						/>
					</label>
				{/if}
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Emergency Contact Name </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						name="emergencyContactName"
						bind:value={$addTenantForm.emergencyContactName}
						{...$constraints.emergencyContactName}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Emergency Contact Email </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
						type="email"
						name="emergencyContactEmail"
						bind:value={$addTenantForm.emergencyContactEmail}
						{...$constraints.emergencyContactEmail}
					/>
				</label>
				<label class="grid w-full gap-2">
					<span class="font-medium text-primary"> Emergency Contact Phone Number </span>
					<input
						class=" rounded-md border-[1px] border-black/60 p-2"
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
					onchange={(e) => {
						const data = e.currentTarget.files
						if (data) {
							for (let i = 0; i <= data?.length; i++) {
								if (data.item(i)) {
									frontFileData = [...frontFileData, data[i].name]
								}
							}
						}
					}}
				/>
				<div class=" grid flex-1 flex-shrink-0 grid-cols-4 items-start gap-2">
					{#each frontFileData as file}
						<div
							class="relative max-w-[180px] items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
						>
							<div class=" relative z-10 h-36 w-32"></div>

							<div class="absolute left-0 top-0 z-30 h-full w-full">
								<div class="flex h-full flex-col items-center justify-center gap-2">
									<FileUpload class="ml-2 h-6 w-6 flex-shrink-0 text-black" />
									<p class="ml-2 py-2 text-sm">{file}</p>
									<button
										onclick={(e) => {
											e.preventDefault()
											// remove the file.id from the frontFileData array
											frontFileData = frontFileData.filter((res) => res !== file)
										}}
									>
										x
									</button>
									>
								</div>
							</div>
						</div>
					{/each}
					<div
						class="relative max-h-96 max-w-[180px] flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
					>
						<div class=" relative z-10 h-36 w-32"></div>
						<div class="absolute left-0 top-0 z-30 h-full w-full">
							<div class="flex h-full flex-col items-center justify-center gap-2">
								<FileUp class="h-7 w-7 text-primary" />
								<span class="text-xs">Upload File</span>
								<p class="px-3 text-center text-[10px]">
									For residential customers upload ID, License or Passport
								</p>
							</div>
						</div>
					</div>
				</div>
			</label>
			<hr class="my-6" />

			<button class="mt-6 w-[420px] rounded-md bg-primary px-6 py-2 text-white">
				Create Tenant</button
			>
		</form>
	</div>
</div>

<!-- {#if fileUploading}
	<div class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
		<div class="bg-white rounded-xl p-8 w-[480px] grid gap-4 mx-12 justify-items-stretch">
			Uploading file wait
		</div>
	</div>
{/if} -->

<script lang="ts">
	import { goto } from '$app/navigation'
	import FileUp from '$lib/assets/file-up.svg.svelte'
	import FileUpload from '$lib/assets/file-upload.svg.svelte'
	import { currencyToNumber, numberToCurrency } from '$lib/utils/currency'
	import { toast } from '@zerodevx/svelte-toast'
	import { superForm } from 'sveltekit-superforms/client'
	import { uploadFiles } from '$lib/utils/upload-files'

	let { data, form } = $props()
	let filesSelected: File[] = []

	$effect.pre(() => {
		form?.addUnitForm && goto('/rental-units')
	})

	const {
		form: addUnitForm,
		enhance: addFormEnhance,
		constraints,
	} = superForm(data.addUnitForm, {
		onSubmit: ({ formData, formElement }) => {
			formData.set('unitFile', 'Unit Files')
			filesSelected = formElement.unitFile.files
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				const uploadPromises = []
				for (const file of filesSelected) {
					uploadPromises.push(
						(async function () {
							const uploadStatus = await uploadFiles(
								file,
								`unitFile/${result.data?.addUnit.id}/${file.name}`,
							)
							if (uploadStatus) {
								const fileDataRes = await fetch('https://hams-one.vercel.app/api/postFileData', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										key: `unitFile/${result.data?.addUnit.id}/${file.name}`,
										fileName: file.name,
										type: 'units',
										id: result.data?.addUnit.id,
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

				if (!successes.find((s) => s !== true)) {
					toast.push('Unit added successfully')
					setTimeout(() => {
						window.location.href = '/rental-units'
					}, 1500)
				}
			}
		},
	})

	let frontFileData: string[] = $state([])
</script>

<div class="mx-10 mt-6">
	<p class="text-xs text-black/50">Rental Units / New Rental Unit</p>
	<div class=" mt-6 rounded-md border-[1px] border-black/20 bg-white p-6 shadow-sm">
		<div class="">
			<p class="text-2xl font-medium">New Rental Unit</p>
			<p class="py-2 text-sm">Register new rental unit here. Click save when you're done.</p>
		</div>
		<form method="post" action="?/addUnit" use:addFormEnhance enctype="multipart/form-data">
			<div class="my-6 grid gap-x-10 md:grid-cols-2">
				<div class="flex flex-col gap-4">
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary">
							Room Number <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<input
							class=" rounded-md border-[1px] border-black/60 p-2"
							required
							name="roomNumber"
							bind:value={$addUnitForm.roomNumber}
							{...$constraints.roomNumber}
						/>
					</label>
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary">
							Floor <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<input
							class=" rounded-md border-[1px] border-black/60 p-2"
							required
							name="floor"
							bind:value={$addUnitForm.floor}
							{...$constraints.floor}
						/>
					</label>
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary">
							Size <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<input
							class=" rounded-md border-[1px] border-black/60 p-2"
							required
							name="size"
							bind:value={$addUnitForm.size}
							{...$constraints.size}
						/>
					</label>

					<label class="grid">
						<span class="font-medium text-primary">
							Unit Type <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<select
							required
							name="unitType"
							bind:value={$addUnitForm.unitType}
							{...$constraints.unitType}
							class="mt-2 rounded-md border-[1px] border-black/60 p-2"
						>
							<option selected disabled value=""> Pick a Type </option>
							<option value="RESIDENTIAL"> Residential </option>
							<option value="COMMERCIAL"> Commercial </option>
						</select>
					</label>
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary">
							Condition <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<select
							required
							name="condition"
							bind:value={$addUnitForm.condition}
							{...$constraints.condition}
							class=" rounded-md border-[1px] border-black/60 p-2"
						>
							<option selected disabled value=""> Unit's Condition </option>
							<option value="OUT_OF_SERVICE"> Out of service </option>
							<option value="NEEDS_REPAIR"> Needs Repair </option>
							<option value="GOOD_CONDITION"> Good Condition </option>
						</select>
					</label>
				</div>
				<div class="mt-4 flex flex-col gap-4 md:mt-0">
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary">
							Price <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600"> {$addUnitForm.inBirr ? 'ETB' : 'USD'} </span>
							<input
								class="w-full rounded-md border-[1px] border-black/60 p-2"
								name="price"
								required
								step="0.01"
								type="number"
								bind:value={$addUnitForm.price}
								{...$constraints.price}
							/>
						</div>
					</label>
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary"> Utility Price </span>
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600"> {$addUnitForm.inBirr ? 'ETB' : 'USD'} </span>
							<input
								class="w-full rounded-md border-[1px] border-black/60 p-2"
								name="utilityPrice"
								type="number"
								step="0.01"
								bind:value={$addUnitForm.utilityPrice}
								{...$constraints.utilityPrice}
							/>
						</div>
					</label>
					<div class="mt-0 flex gap-10 md:mt-8">
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								name="inBirr"
								bind:checked={$addUnitForm.inBirr}
								{...$constraints.inBirr}
								class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
							/>
							<span class="font-medium text-primary"> Price set In Birr </span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								name="perKare"
								bind:checked={$addUnitForm.perKare}
								{...$constraints.perKare}
								class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
							/>
							<span class="font-medium text-primary"> Price set in m2 </span>
						</label>
					</div>

					<label class="mt-4 grid w-full gap-2">
						<span class="font-medium text-primary"> Minimum Rental Day </span>
						<input
							required
							name="minimumRentalDate"
							bind:value={$addUnitForm.minimumRentalDate}
							{...$constraints.minimumRentalDate}
							class=" rounded-md border-[1px] border-black/60 p-2"
						/>
					</label>
					<label class="grid w-full gap-2">
						<span class="font-medium text-primary"> Number of People Allowed </span>
						<input
							required
							name="maximumTenants"
							bind:value={$addUnitForm.maximumTenants}
							{...$constraints.maximumTenants}
							class=" rounded-md border-[1px] border-black/60 p-2"
						/>
					</label>
				</div>
			</div>
			<div>
				<hr class="my-6" />
				<div class=" grid flex-1 flex-shrink-0 grid-cols-4 items-start gap-2">
					<label>
						<input
							class="hidden"
							type="file"
							name="unitFile"
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
						<div
							class="relative max-h-96 max-w-[180px] flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
						>
							<div class=" relative z-10 h-36 w-32"></div>
							<div class="absolute left-0 top-0 z-30 h-full w-full">
								<div class="flex h-full flex-col items-center justify-center gap-2">
									<FileUp class="h-7 w-7 text-primary" />
									<span class="text-xs">Upload File</span>
									<p class="px-3 text-center text-[10px]">
										Contract, Agreement, pictures or any other document
									</p>
								</div>
							</div>
						</div>
					</label>
					{#each frontFileData as file}
						<div
							class="relative max-w-[180px] items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
						>
							<div class=" relative z-10 h-36 w-32"></div>

							<div class="absolute left-0 top-0 z-30 h-full w-full">
								<div class="flex h-full flex-col items-center justify-center gap-2">
									<FileUpload class="ml-2 h-6 w-6 flex-shrink-0 text-black" />
									<p class="line-clamp-1 w-full px-3 py-2 text-sm">{file}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<button class="mt-6 w-fit rounded-md bg-primary px-6 py-2 text-white"> Create unit</button>
			</div>
		</form>
	</div>
</div>

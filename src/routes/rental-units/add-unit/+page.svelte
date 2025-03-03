<script lang="ts">
	import { run } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import { currencyToNumber, numberToCurrency } from '$lib/utils/currency';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import { uploadFiles } from '$lib/utils/upload-files';

	let { data, form } = $props();
	let filesSelected: File[] = [];

	run(() => {
		form?.addUnitForm && goto('/rental-units');
	});

	const {
		form: addUnitForm,
		enhance: addFormEnhance,
		constraints
	} = superForm(data.addUnitForm, {
		onSubmit: ({ formData, formElement }) => {
			formData.set('unitFile', 'Unit Files');
			filesSelected = formElement.unitFile.files;
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				const uploadPromises = [];
				for (const file of filesSelected) {
					uploadPromises.push(
						(async function () {
							const uploadStatus = await uploadFiles(
								file,
								`unitFile/${result.data?.addUnit.id}/${file.name}`
							);
							if (uploadStatus) {
								const fileDataRes = await fetch('https://hams-one.vercel.app/api/postFileData', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										key: `unitFile/${result.data?.addUnit.id}/${file.name}`,
										fileName: file.name,
										type: 'units',
										id: result.data?.addUnit.id
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
					toast.push('Unit added successfully');
					setTimeout(() => {
						window.location.href = '/rental-units';
					}, 1500);
				}
			}
		}
	});

	let frontFileData: string[] = $state([]);
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Rental Units / New Rental Unit</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<div class="">
			<p class="text-2xl font-medium">New Rental Unit</p>
			<p class="text-sm py-2">Register new rental unit here. Click save when you're done.</p>
		</div>
		<form method="post" action="?/addUnit" use:addFormEnhance>
			<div class="grid md:grid-cols-2 gap-x-10 my-6">
				<div class="flex flex-col gap-4">
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium">
							Room Number <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<input
							class=" border-[1px] border-black/60 rounded-md p-2"
							required
							name="roomNumber"
							bind:value={$addUnitForm.roomNumber}
							{...$constraints.roomNumber}
						/>
					</label>
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium">
							Floor <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<input
							class=" border-[1px] border-black/60 rounded-md p-2"
							required
							name="floor"
							bind:value={$addUnitForm.floor}
							{...$constraints.floor}
						/>
					</label>
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium">
							Size <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<input
							class=" border-[1px] border-black/60 rounded-md p-2"
							required
							name="size"
							bind:value={$addUnitForm.size}
							{...$constraints.size}
						/>
					</label>

					<label class="grid">
						<span class="text-primary font-medium">
							Unit Type <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<select
							required
							name="unitType"
							bind:value={$addUnitForm.unitType}
							{...$constraints.unitType}
							class="mt-2 border-[1px] border-black/60 rounded-md p-2"
						>
							<option selected disabled value=""> Pick a Type </option>
							<option value="RESIDENTIAL"> Residential </option>
							<option value="COMMERCIAL"> Commercial </option>
						</select>
					</label>
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium">
							Condition <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<select
							required
							name="condition"
							bind:value={$addUnitForm.condition}
							{...$constraints.condition}
							class=" border-[1px] border-black/60 rounded-md p-2"
						>
							<option selected disabled value=""> Unit's Condition </option>
							<option value="OUT_OF_SERVICE"> Out of service </option>
							<option value="NEEDS_REPAIR"> Needs Repair </option>
							<option value="GOOD_CONDITION"> Good Condition </option>
						</select>
					</label>
				</div>
				<div class="flex flex-col gap-4 mt-4 md:mt-0">
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium">
							Price <span class="text-xs font-light text-danger"> * Required </span>
						</span>
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600"> {$addUnitForm.inBirr ? 'ETB' : 'USD'} </span>
							<input
								class="border-[1px] w-full border-black/60 rounded-md p-2"
								name="price"
								required
								step="0.01"
								type="number"
								bind:value={$addUnitForm.price}
								{...$constraints.price}
							/>
						</div>
					</label>
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium"> Utility Price </span>
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600"> {$addUnitForm.inBirr ? 'ETB' : 'USD'} </span>
							<input
								class="border-[1px] w-full border-black/60 rounded-md p-2"
								name="utilityPrice"
								type="number"
								step="0.01"
								bind:value={$addUnitForm.utilityPrice}
								{...$constraints.utilityPrice}
							/>
						</div>
					</label>
					<div class="flex mt-0 md:mt-8 gap-10">
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								name="inBirr"
								bind:checked={$addUnitForm.inBirr}
								{...$constraints.inBirr}
								class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
							/>
							<span class="text-primary font-medium"> Price set In Birr </span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								name="perKare"
								bind:checked={$addUnitForm.perKare}
								{...$constraints.perKare}
								class=" h-5 w-5 border-[1px] border-black/60 rounded-md p-2"
							/>
							<span class="text-primary font-medium"> Price set in m2 </span>
						</label>
					</div>

					<label class="w-full grid gap-2 mt-4">
						<span class="text-primary font-medium"> Minimum Rental Day </span>
						<input
							required
							name="minimumRentalDate"
							bind:value={$addUnitForm.minimumRentalDate}
							{...$constraints.minimumRentalDate}
							class=" border-[1px] border-black/60 rounded-md p-2"
						/>
					</label>
					<label class="w-full grid gap-2">
						<span class="text-primary font-medium"> Number of People Allowed </span>
						<input
							required
							name="maximumTenants"
							bind:value={$addUnitForm.maximumTenants}
							{...$constraints.maximumTenants}
							class=" border-[1px] border-black/60 rounded-md p-2"
						/>
					</label>
				</div>
			</div>
			<div>
				<hr class="my-6" />
				<div class=" flex-1 flex-shrink-0 grid grid-cols-4 items-start gap-2">
					<label>
						<input
							class="hidden"
							type="file"
							name="unitFile"
							multiple
							onchange={(e) => {
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
						<div
							class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"
						>
							<div class=" relative z-10 w-32 h-36"></div>
							<div class="absolute top-0 w-full h-full left-0 z-30">
								<div class="flex flex-col gap-2 justify-center items-center h-full">
									<FileUp class="text-primary w-7 h-7" />
									<span class="text-xs">Upload File</span>
									<p class="text-[10px] text-center px-3">
										Contract, Agreement, pictures or any other document
									</p>
								</div>
							</div>
						</div>
					</label>
					{#each frontFileData as file}
						<div
							class="relative border-[1px] max-w-[180px] border-primary border-dashed rounded-lg gap-2 items-center justify-center"
						>
							<div class=" relative z-10 w-32 h-36"></div>

							<div class="absolute top-0 w-full h-full left-0 z-30">
								<div class="flex flex-col gap-2 justify-center items-center h-full">
									<FileUpload class="h-6 w-6 flex-shrink-0 ml-2 text-black" />
									<p class="text-sm py-2 px-3 w-full line-clamp-1">{file}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<button class="bg-primary text-white rounded-md py-2 px-6 w-fit mt-6"> Create unit</button>
			</div>
		</form>
	</div>
</div>

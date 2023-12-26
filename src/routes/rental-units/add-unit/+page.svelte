<script lang="ts">
	import { goto } from '$app/navigation';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import QR from '$lib/assets/qr.png';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	export let data;
	export let form;
	$: form?.addUnitForm && goto('/rental-units');
	$: form?.addUnitForm && toast.push('Unit added successfully');
	const { form: addUnitForm, enhance: addFormEnhance, constraints } = superForm(data.addUnitForm);

	let frontFileData: string[] = [];
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Rental Units / New Rental Unit</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<div class="">
			<p class="text-2xl font-medium">New Rental Unit</p>
			<p class="text-sm py-2">Register new rental unit here. Click save when you're done.</p>
		</div>
		<form method="post" action="?/addUnit" use:addFormEnhance class="grid grid-flow-col mt-6">
			<div class="flex flex-col gap-4">
				<label class="grid">
					<span class="text-primary font-medium"> Room Number </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="roomNumber"
						bind:value={$addUnitForm.roomNumber}
						{...$constraints.roomNumber}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Floor </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="floor"
						bind:value={$addUnitForm.floor}
						{...$constraints.floor}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Size </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="size"
						bind:value={$addUnitForm.size}
						{...$constraints.size}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Price </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="price"
						bind:value={$addUnitForm.price}
						{...$constraints.price}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Unit Type </span>
					<select
						required
						name="unitType"
						bind:value={$addUnitForm.unitType}
						{...$constraints.unitType}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Pick a Type </option>
						<option value="RESIDENTIAL"> Residential </option>
						<option value="COMMERCIAL"> Commercial </option>
					</select>
				</label>
				<hr class="my-4" />

				<label>
					<input
						class="hidden"
						type="file"
						name="unitFile"
						accept="image/*"
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
								</div>
							</div>
						</div>
					</div>
				</label>
				<hr class="my-6" />

				<button class="bg-primary text-white rounded-md py-2 px-6 w-fit"> Create unit</button>
			</div>
			<div class="flex flex-col gap-4">
				<label class="grid">
					<span class="text-primary font-medium"> Condition </span>
					<select
						required
						name="condition"
						bind:value={$addUnitForm.condition}
						{...$constraints.condition}
						class="mt-2 w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Pick a role </option>
						<option value="OUT_OF_SERVICE"> Out of service </option>
						<option value="NEEDS_REPAIR"> Needs Repair </option>
						<option value="GOOD_CONDITION"> Good Condition </option>
					</select>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Minimum Rental Day </span>
					<input
						required
						name="minimumRentalDate"
						bind:value={$addUnitForm.minimumRentalDate}
						{...$constraints.minimumRentalDate}
						class="w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Number of People Allowed </span>
					<input
						required
						name="maximumTenants"
						bind:value={$addUnitForm.maximumTenants}
						{...$constraints.maximumTenants}
						class="w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
			</div>
		</form>
	</div>
</div>

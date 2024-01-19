<script lang="ts">
	import { clickOutside } from '$lib/utils/click-outside';
	import { superForm } from 'sveltekit-superforms/client';

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Delete from '$lib/assets/delete.svg.svelte';
	import Eye from '$lib/assets/eye.svg.svelte';
	import FileBg from '$lib/assets/file-bg.png';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let dateInput: any;

	const {
		form: editUnitForm,
		enhance: editUnitFormEnhance,
		constraints
	} = superForm(data.editUnitForm);

	let frontFileData: string[] = [];
	$: form?.deleteFile
		? toast.push('File deleted successfully', { theme: { '--toastBackground': '#059669' } })
		: null;
	$: form?.fileUrl ? window.open(form.fileUrl, '_blank') : null;
	// $: newFiles = form?.allNewFiles;
	$: form?.deletedUnit ? goto('/rental-units') : null;
	$: form?.addInspection ? toast.push('Inspection added successfully') : null;
	let modal = false;
</script>

<div>
	<form use:editUnitFormEnhance method="post" action="?/editUnitInfo">
		<div class="grid grid-flow-col justify-items-stretch">
			<div class="grid">
				<p class="text-2xl">Rental Unit Info</p>
				<p class=" text-sm py-1 rounded-xl">Room details here.</p>
			</div>
			<div class="justify-self-end">
				<button
					on:click|preventDefault={() => (modal = true)}
					class="bg-warning text-black/70 rounded-md py-2 px-6 mr-4"
				>
					New Inspection
				</button>

				<button type="submit" class="bg-primary text-white rounded-md py-2 px-6">
					Update Info
				</button>
			</div>
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 grid-cols-4">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Room No.</span>
				<input
					name="roomNumber"
					bind:value={$editUnitForm.roomNumber}
					{...$constraints.roomNumber}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Floor</span>
				<input name="floor" bind:value={$editUnitForm.floor} {...$constraints.floor} class="" />
			</label>

			<div class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Status</span>
				<div>Available</div>
			</div>

			<label class="grid">
				<span class="text-primary font-semibold py-1"> Condition </span>
				<select
					disabled
					name="condition"
					bind:value={$editUnitForm.condition}
					{...$constraints.condition}
				>
					<option selected disabled> Unit Condition </option>

					<option value="GOOD_CONDITION"> Good Condition </option>
					<option value="NEEDS_REPAIR"> Needs Repair </option>
					<option value="OUT_OF_SERVICE"> Out of service </option>
				</select>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Size</span>
				<input name="size" bind:value={$editUnitForm.size} {...$constraints.size} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Price</span>
				<input name="price" bind:value={$editUnitForm.price} {...$constraints.price} />
			</label>

			<label class="grid">
				<span class="text-primary font-semibold py-1"> Unit Type </span>
				<select
					required
					name="unitType"
					bind:value={$editUnitForm.unitType}
					{...$constraints.unitType}
				>
					<option selected disabled> Pick a Type </option>
					<option value="RESIDENTIAL"> Residential </option>
					<option value="COMMERCIAL"> Commercial </option>
				</select>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> No. of People Allowed</span>
				<input
					name="maximumTenants"
					bind:value={$editUnitForm.maximumTenants}
					{...$constraints.maximumTenants}
				/>
			</label>
		</div>

		<div class=" w-full p-4 mb-8 flex-1 flex-shrink-0 flex flex-wrap items-start gap-2">
			{#each data.unitDetails?.UnitsFile ?? [] as file}
				<div class="border-[1px] w-[180px] border-primary border-dashed rounded-lg">
					<div class="relative">
						<div class=" relative z-10 w-full h-36">
							<img src={FileBg} alt="bg" class="w-full h-full" />
						</div>

						<div class="absolute top-0 w-full h-full left-0 z-30">
							<div class="flex flex-col gap-2 justify-center items-center h-full">
								<form
									id="downloadUnitFile"
									method="post"
									action="?/downloadUnitFile"
									use:enhance={({ formData }) => {
										formData.set('unitKey', `${file.File.key}`);
									}}
								>
									<button on:click|stopPropagation={() => console.log('download')} type="submit">
										<div class="h-full flex flex-col items-center justify-center">
											<Eye class="text-primary w-7 h-7" />
											<p class="text-sm ml-2 flex-1 line-clamp-1 py-2">{file.File.fileName}</p>
										</div>
									</button>
								</form>
							</div>
						</div>
					</div>
					<form
						id="deleteUnitFile"
						method="post"
						action="?/deleteUnitFile"
						use:enhance={({ formData }) => {
							formData.set('unitFileId', `${file.fileId}`);
						}}
					>
						<button
							on:click|stopPropagation={() => console.log('hello')}
							class="flex gap-1 items-center justify-center w-full p-2"
						>
							<Delete class="h-5 w-5 text-danger" />
							<span class="text-danger text-sm">Delete</span>
						</button>
					</form>
				</div>
			{/each}
			<div
				class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"
			>
				<form id="editUnitFile" method="post" action="?/editUnitFile" use:enhance>
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
								e.currentTarget.form?.requestSubmit();
							}}
						/>

						<div class=" relative z-10 h-44" />
						<div class="absolute top-0 w-full h-full left-0 z-30">
							<div class="flex flex-col gap-2 justify-center items-center h-full">
								<FileUp class="text-primary w-7 h-7" />
								<span class="text-xs">Upload File</span>
							</div>
						</div>
					</label>
				</form>
			</div>
		</div>
	</form>

	<p class="text-2xl mt-6">Danger</p>
	<hr class="my-6" />

	<div class="border-2 border-danger border-dashed rounded-md p-5">
		<div class="flex justify-between">
			<div>
				<p class="text-lg">Archive Rental Unit</p>
				<p class="text-black/50">
					Remove all data related to rental unit. Once you take this action there is no going back.
				</p>
			</div>
			<form method="post" action="?/archiveUnit" use:enhance>
				{#if !data.unitDetails?.active}
					<button
						on:click|stopPropagation={() => toast.push('Can not delete a Unit with Tenant in it.')}
						class="bg-subtitle text-white rounded-md py-2 px-6">Archive</button
					>
				{:else}
					<button class="bg-danger text-white rounded-md py-2 px-6">Archive</button>
				{/if}
			</form>
		</div>
	</div>
</div>

{#if modal}
	<form
		method="post"
		action="?/addInspection"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				modal = false;
			};
		}}
	>
		<div
			class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		>
			<div
				use:clickOutside={() => (modal = false)}
				class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
			>
				<div class="text-2xl text-primary font-semibold mb-1 text-center">New Inspection</div>
				<hr />
				<label class="grid flex-1">
					<span class="text-primary font-semibold py-1"> Inspection Date </span>
					<input
						required
						name="inspectionDate"
						type="date"
						bind:this={dateInput}
						on:click={() => {
							dateInput && dateInput.showPicker();
						}}
						class=" border-[1px] border-primary/50 rounded-md p-2"
					/>
				</label>

				<label class="grid">
					<span class="text-primary font-semibold py-1"> Condition </span>
					<select
						required
						name="inspectionCondition"
						bind:value={$editUnitForm.condition}
						{...$constraints.condition}
						class=" border-[1px] border-primary/50 rounded-md p-2"
					>
						<option selected disabled> Unit Condition </option>

						<option value="GOOD_CONDITION"> Good Condition </option>
						<option value="NEEDS_REPAIR"> Needs Repair </option>
						<option value="OUT_OF_SERVICE"> Out of service </option>
					</select>
				</label>
				<label class="grid flex-1">
					<span class="text-primary font-semibold py-2"> Inspection Description </span>
					<textarea
						name="inspectionDescription"
						class=" border-[1px] h-24 border-primary/50 rounded-md p-2"
					/>
				</label>
				<button type="submit" class="bg-primary text-white rounded-md py-2">
					Save Inspection</button
				>
			</div>
		</div>
	</form>
{/if}

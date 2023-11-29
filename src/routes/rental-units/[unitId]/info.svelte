<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import FileBg from '$lib/assets/file-bg.png';
	import Upload from '$lib/assets/upload.svg.svelte';
	import { enhance } from '$app/forms';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import Delete from '$lib/assets/delete.svg.svelte';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import Eye from '$lib/assets/eye.svg.svelte';
	import type { ActionData } from './$types';
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;
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
</script>

<div>
	<form use:editUnitFormEnhance method="post" action="?/editUnitInfo">
		<div class="flex justify-between">
			<div class="grid">
				<p class="text-2xl">Rental Unit Info</p>
				<p class=" text-sm py-1 rounded-xl">Room details here.</p>
			</div>
			<button type="submit" class="bg-primary text-white rounded-md py-2 px-6"> Update Info</button>
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
					required
					name="condition"
					bind:value={$editUnitForm.condition}
					{...$constraints.condition}
				>
					<option selected disabled> Pick a role </option>
					<option value="OUT_OF_SERVICE"> Out of service </option>
					<option value="NEEDS_REPAIR"> Needs Repair </option>
					<option value="GOOD_CONDITION"> Good Condition </option>
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
				<div
					class="relative border-[1px] max-w-[180px] border-primary border-dashed rounded-lg gap-2 items-center justify-center"
				>
					<div class=" relative z-10 w-full h-36 bg-red-50">
						<img src={FileBg} alt="bg" class="w-full h-full" />
					</div>

					<div class="absolute top-0 w-full h-full left-0 z-30 pointer-events-none">
						<div class="flex flex-col gap-2 justify-center items-center h-full">
							<form
								method="post"
								action="?/downloadUnitFile"
								use:enhance={({ formData }) => {
									formData.set('unitKey', `${file.File.key}`);
								}}
							>
								<button type="submit">
									<div class="h-full flex flex-col items-center justify-center">
										<Eye class="text-primary w-7 h-7" />
										<p class="text-sm ml-2 flex-1 line-clamp-1 py-2">{file.File.fileName}</p>
									</div>
								</button>
							</form>
						</div>
					</div>

					<form
						method="post"
						action="?/deleteUnitFile"
						use:enhance={({ formData }) => {
							formData.set('unitFileId', `${file.fileId}`);
						}}
					>
						<button on:click={() => console.log('hello')}>
							<Delete class="h-10 w-10" />
						</button>
					</form>
				</div>
			{/each}
			<div
				class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"
			>
				<form method="post" action="?/editUnitFile" use:enhance>
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

						<div class=" relative z-10 h-48" />
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
		<hr class="my-6" />
	</form>

	<p class="text-2xl mt-10">Danger</p>
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
				<button class="bg-danger text-white rounded-md py-2 px-6">Archive</button>
			</form>
		</div>
	</div>
</div>

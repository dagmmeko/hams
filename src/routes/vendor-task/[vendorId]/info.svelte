<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import Delete from '$lib/assets/delete.svg.svelte';
	import Eye from '$lib/assets/eye.svg.svelte';
	import FileBg from '$lib/assets/file-bg.png';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let data: PageData;

	export let form: ActionData;

	const {
		form: editVendorForm,
		enhance: editFormEnhance,
		constraints
	} = superForm(data.editVendorForm);

	$: form?.vendor ? toast.push('Vendor info updated') : '';

	let frontFileData: string[] = [];

	$: form?.errorMessage ? toast.push(form.errorMessage) : null;
	$: form?.vendorFileUrl ? window.open(form.vendorFileUrl, '_blank') : null;

	$: form?.deletedVendorFile ? toast.push('File deleted successfully') : null;
</script>

<div class="p-6">
	<form use:editFormEnhance method="post" action="?/editVendorInfo">
		<div class="md:flex justify-between">
			<div class="grid">
				<p class="text-2xl">Vendor Info</p>
				<p class=" text-sm py-1 rounded-xl">Vendor details here.</p>
			</div>
			{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_VENDOR')}
				<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 px-6">
					Update Info</button
				>
			{/if}
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Vendor Name</span>
				<input name="name" bind:value={$editVendorForm.name} {...$constraints.name} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Contact number</span>
				<input
					name="phoneNumber"
					bind:value={$editVendorForm.phoneNumber}
					{...$constraints.phoneNumber}
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Address</span>
				<input name="address" bind:value={$editVendorForm.address} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Service Type </span>
				<select
					name="ServiceType"
					bind:value={$editVendorForm.ServiceType}
					{...$constraints.ServiceType}
				>
					<option selected disabled>Select Service Type</option>
					<option value="CLEANING">Cleaning</option>
					<option value="ELECTRICITY">Electricity</option>
					<option value="PLUMBING">Plumbing</option>
					<option value="PAINTING">Painting</option>
					<option value="SECURITY">Security</option>
				</select>
			</label>

			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Email</span>
				<input name="email" bind:value={$editVendorForm.email} {...$constraints.email} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Score</span>
				<input name="score" bind:value={$editVendorForm.score} />
			</label>
		</div>
		<div class="mt-4">
			<label class="grid">
				<span class="text-primary font-semibold py-1"> Description</span>
				<textarea
					class="max-w-md border-[1px] border-[#3b82f6]/30 rounded-md p-2"
					name="serviceDescription"
					bind:value={$editVendorForm.serviceDescription}
					{...$constraints.serviceDescription}
				/>
			</label>
		</div>
		<div class=" w-full p-4 mb-8 flex-1 flex-shrink-0 flex flex-wrap items-start gap-2">
			{#each data.vendor.VendorFile ?? [] as file}
				<div class="border-[1px] w-[180px] border-primary border-dashed rounded-lg">
					<div class="relative">
						<div class=" relative z-10 w-full h-36">
							<img src={FileBg} alt="bg" class="w-full h-full" />
						</div>

						<div class="absolute top-0 w-full h-full left-0 z-30">
							<div class="flex flex-col gap-2 justify-center items-center h-full">
								<form
									id="downloadVendorFile"
									method="post"
									action="?/downloadVendorFile"
									use:enhance={({ formData }) => {
										formData.set('vendorFileKey', `${file.File.key}`);
									}}
								>
									<button on:click|stopPropagation type="submit">
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
						action="?/deleteVendorFile"
						use:enhance={({ formData }) => {
							formData.set('deleteVendorFileId', `${file.fileId}`);
						}}
					>
						<button
							on:click|stopPropagation
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
				<form id="editVendorFile" method="post" action="?/editVendorFile" use:enhance>
					<label>
						<input
							class="hidden"
							type="file"
							name="vendorFile"
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
								<p class="text-[10px] text-center px-3">
									Contract, Agreement, pictures or any other document
								</p>
							</div>
						</div>
					</label>
				</form>
			</div>
		</div>
	</form>
	{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_VENDOR')}
		<p class="text-2xl mt-10">Danger</p>
		<hr class="my-6" />

		<div class="border-2 border-danger border-dashed rounded-md p-5">
			<div class="md:flex justify-between">
				<div>
					<p class="text-lg">Delete Vendor</p>
					<p class="text-black/50">
						Remove all data related to vendor.Once you take this action their is no going back
					</p>
				</div>
				<button class="bg-danger flex text-white rounded-md py-2 px-6"
					><Delete /> Delete Vendor</button
				>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import type { ActionData, PageData } from './$types';
	import FileBg from '$lib/assets/file-bg.png';
	import Eye from '$lib/assets/eye.svg.svelte';
	import Delete from '$lib/assets/delete.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageData;
	export let form: ActionData;
	const {
		form: editTenantForm,
		enhance: editTenantFormEnhance,
		constraints
	} = superForm(data.editTenantForm);
	let frontFileData: string[] = [];
	$: form?.editTenant ? toast.push('Tenant updated successfully') : null;
</script>

<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
	<form use:editTenantFormEnhance method="post" action="?/editTenant">
		<div class="grid grid-flow-col justify-items-stretch">
			<div class="grid">
				<p class="text-2xl">Tenant Info</p>
				<p class=" text-sm py-1 rounded-xl">Tenant details here.</p>
			</div>
			<div class="justify-self-end">
				<button type="submit" class="bg-primary text-white rounded-md py-2 px-6">
					Update Info
				</button>
			</div>
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 grid-cols-4">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Full Name</span>
				<input
					name="fullName"
					bind:value={$editTenantForm.fullName}
					{...$constraints.fullName}
					class="border-2"
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Phone Number</span>
				<input
					name="phoneNumber"
					bind:value={$editTenantForm.phoneNumber}
					{...$constraints.phoneNumber}
					class="border-2"
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Email </span>
				<input
					name="email"
					bind:value={$editTenantForm.email}
					{...$constraints.email}
					class="border-2"
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Name</span>
				<input
					name="roomNumber"
					bind:value={$editTenantForm.emergencyContactName}
					{...$constraints.emergencyContactName}
					class="border-2"
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Phone Number</span>
				<input
					name="emergencyContactPhoneNumber"
					bind:value={$editTenantForm.emergencyContactPhoneNumber}
					{...$constraints.emergencyContactPhoneNumber}
					class="border-2"
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Email</span>
				<input
					name="emergencyContactEmail"
					bind:value={$editTenantForm.emergencyContactEmail}
					{...$constraints.emergencyContactEmail}
					class="border-2"
				/>
			</label>
		</div>
	</form>
	<div class="grid grid-cols-2 mt-6 gap-8">
		<div>
			<div class="w-full text-xl mb-4">Active Rooms</div>

			{#each data.tenant?.TenantRental ?? [] as tenantUnit}
				{#if tenantUnit.active}
					<div class="bg-green-50">{tenantUnit.RentalUnits.roomNumber}</div>
				{/if}
			{/each}
		</div>
		<div class=" w-full">
			<div class="w-full text-xl mb-4">Tenant Files</div>
			<div class="flex-1 flex-shrink-0 flex flex-wrap items-start gap-2">
				{#each data.tenant?.TenantsFile ?? [] as file}
					<div class="border-[1px] w-[180px] border-primary border-dashed rounded-lg">
						<div class="relative">
							<div class=" relative z-10 w-full h-36">
								<img src={FileBg} alt="bg" class="w-full h-full" />
							</div>

							<div class="absolute top-0 w-full h-full left-0 z-30">
								<div class="flex flex-col gap-2 justify-center items-center h-full">
									<form
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
		</div>
	</div>

	<p class="text-2xl mt-6">Danger</p>
	<hr class="my-6" />

	<div class="border-2 border-danger border-dashed rounded-md p-5">
		<div class="flex justify-between">
			<div>
				<p class="text-lg">Archive Tenant</p>
				<p class="text-black/50">
					Remove all data related to the Tenant. You can access the data by using the archive
					filter.
				</p>
			</div>
			<form method="post" action="?/archiveUnit" use:enhance>
				{#if data.tenant?.TenantRental.find((unit) => unit.active)?.active}
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

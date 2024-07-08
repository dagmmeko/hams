<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Delete from '$lib/assets/delete.svg.svelte';
	import Eye from '$lib/assets/eye.svg.svelte';
	import FileBg from '$lib/assets/file-bg.png';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import { clickOutside } from '$lib/utils/click-outside';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';

	import dayjs from 'dayjs';
	import EndContract from './end-contract.svelte';
	import ExtendContract from './extend-contract.svelte';
	import { uploadFiles } from '$lib/utils/upload-files';
	import EditRentedUnit from './edit-rented-unit.svelte';

	export let data: PageData;
	export let form: ActionData;
	const {
		form: editTenantForm,
		enhance: editTenantFormEnhance,
		constraints
	} = superForm(data.editTenantForm);
	$: form?.editTenant ? toast.push('Tenant updated successfully') : null;
	$: form?.deleteFile ? toast.push('File deleted successfully') : null;
	$: form?.allNewFiles ? toast.push('Files uploaded successfully') : null;
	$: form?.errorMessage ? toast.push(form.errorMessage) : null;
	let extendContractModal = false;
	let unitToExtend: any;
	let endContractModal = false;
	let unitToEnd: any;
	let fileNames: string[] = [];
	let editRentedUnitModal = false;
	let selectedRentedUnitId: any;
</script>

<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
	<form use:editTenantFormEnhance method="post" action="?/editTenant">
		<div class="md:grid grid-flow-col justify-items-stretch">
			<div class="grid">
				<p class="text-2xl">Tenant Info</p>
				<p class=" text-sm py-1 rounded-xl">Tenant details here.</p>
			</div>
			{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_TENANT')}
				<div class="justify-self-end">
					<button type="submit" class="bg-primary text-white rounded-md py-2 px-6">
						Update Info
					</button>
				</div>
			{/if}
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Full Name</span>
				<input
					name="fullName"
					bind:value={$editTenantForm.fullName}
					{...$constraints.fullName}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Phone Number</span>
				<input
					name="phoneNumber"
					bind:value={$editTenantForm.phoneNumber}
					{...$constraints.phoneNumber}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Email </span>
				<input name="email" bind:value={$editTenantForm.email} {...$constraints.email} class="" />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Name</span>
				<input
					name="emergencyContactName"
					bind:value={$editTenantForm.emergencyContactName}
					{...$constraints.emergencyContactName}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Phone </span>
				<input
					name="emergencyContactPhoneNumber"
					bind:value={$editTenantForm.emergencyContactPhoneNumber}
					{...$constraints.emergencyContactPhoneNumber}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Email</span>
				<input
					name="emergencyContactEmail"
					bind:value={$editTenantForm.emergencyContactEmail}
					{...$constraints.emergencyContactEmail}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Passport Number</span>
				<input
					name="passportNumber"
					bind:value={$editTenantForm.passportNumber}
					{...$constraints.passportNumber}
					class=""
				/>
			</label>
		</div>
	</form>
	<div class="grid md:grid-cols-2 grid-cols-1 mt-6 gap-8">
		<div>
			<div class="w-full font-medium text-xl mb-1">Active Rooms</div>
			<hr class="mb-1" />
			<div class="h-60 overflow-y-auto">
				{#each data.tenant?.TenantRental ?? [] as tenantUnit}
					{#if tenantUnit.active && tenantUnit.exitingTenant === false}
						<div class="bg-primary/10 w-full shadow-md p-2 mb-3 rounded-md">
							<button
								on:click={() => {
									editRentedUnitModal = true;
									selectedRentedUnitId = tenantUnit.id;
								}}
								class="text-left border-[1px] rounded-md w-full border-black p-2"
							>
								<div class="">
									<span class="font-medium">Company Name:</span>
									{tenantUnit.companyName}
								</div>
								<div class="">
									<span class="font-medium">Purpose of Rent:</span>
									{tenantUnit.purposeOfRent}
								</div>
								<div class="font-light">
									<span class="font-medium">Room No: </span>{tenantUnit.RentalUnits.roomNumber}
								</div>

								<div><span class="font-medium">TIN:</span> {tenantUnit.tinNumber ?? 'N/A'}</div>
								<div>
									<span class="font-medium">Security Deposit:</span>
									{tenantUnit.securityDeposit}
								</div>
								<div>
									<span class="font-medium">Contract Start - End:</span>
									{dayjs(tenantUnit.contractStartDate).format('MMM DD/YY')} - {dayjs(
										tenantUnit.contractEndDate
									).format('MMM DD/YY')}
								</div>
							</button>

							<div class="flex gap-2 mt-1">
								{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'START_END_RENT')}
									<button
										class="bg-orange-600 rounded-md p-2 text-xs text-white"
										on:click|preventDefault={() => {
											extendContractModal = true;
											unitToExtend = tenantUnit.id;
										}}
									>
										Start End Process
									</button>
								{/if}
								{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EXTEND_RENT')}
									<button
										class="bg-info rounded-md p-2 text-xs text-white"
										on:click|preventDefault={() => {
											endContractModal = true;
											unitToEnd = tenantUnit.id;
										}}
									>
										Extend Contract
									</button>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<div class=" w-full">
			<div class="w-full font-medium text-xl mb-4">Tenant Files</div>
			<div class="grid grid-cols-3 h-60 overflow-y-auto items-start gap-2">
				{#each data.tenant?.TenantsFile ?? [] as file}
					<div class="border-[1px] border-primary border-dashed rounded-lg">
						<div class="relative">
							<div class=" relative z-10 w-full h-36">
								<img src={FileBg} alt="bg" class="w-full h-full" />
							</div>

							<div class="absolute top-0 w-full h-full left-0 z-30">
								<form
									method="post"
									action="?/downloadTenantFile"
									use:enhance={({ formData }) => {
										formData.set('tenantKey', `${file.File.key}`);
										return async ({ result, update }) => {
											if (result.type === 'success') {
												// @ts-ignore
												window.open(result.data.fileUrl, '_blank');
											}
										};
									}}
									class="flex flex-col gap-2 justify-center items-center h-full"
								>
									<button on:click|stopPropagation type="submit">
										<div class="h-full w-full flex flex-col items-center justify-center">
											<Eye class="text-primary w-7 h-7" />
											<span class="text-sm mx-3 py-2 break-all">
												{file.File.fileName}
											</span>
										</div>
									</button>
								</form>
							</div>
						</div>
						<form
							method="post"
							action="?/deleteTenantFile"
							use:enhance={({ formData }) => {
								formData.set('tenantFileId', `${file.fileId}`);
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
					class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 w-full max-h-96 gap-2 items-center justify-center"
				>
					<form
						method="post"
						action="?/editTenantFile"
						use:enhance={({ formData }) => {
							formData.set('fileNames', fileNames.join(','));
							formData.set('tenantFile', 'Files');
						}}
					>
						<label>
							<input
								class="hidden"
								type="file"
								name="tenantFile"
								multiple
								on:change={async (e) => {
									const uploadPromises = [];
									const cal = e.currentTarget.form;
									for (const file of e.currentTarget.files ?? []) {
										uploadPromises.push(
											(async function () {
												if (data.tenant) {
													fileNames = [...fileNames, file.name];
													return await uploadFiles(
														file,
														`tenantsFile/${data.tenant.id}/${file.name}`
													);
												}
											})()
										);
									}
									const successes = await Promise.all(uploadPromises);

									if (!successes.find((s) => s !== true)) {
										// @ts-ignore
										cal.requestSubmit();
									}
								}}
							/>

							<div class=" relative z-10 h-44" />
							<div class="absolute top-0 w-full h-full left-0 z-30">
								<div class="flex flex-col gap-2 justify-center items-center h-full">
									<FileUp class="text-primary w-7 h-7" />
									<span class="text-xs">Upload File</span>
									<p class="text-[10px] text-center px-3">
										For residential customers upload ID, License or Passport
									</p>
								</div>
							</div>
						</label>
					</form>
				</div>
			</div>
		</div>
	</div>
	{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_TENANT')}
		<p class="text-2xl mt-6">Danger</p>
		<hr class="my-6" />

		<div class="border-2 border-danger border-dashed rounded-md p-5">
			<div class="md:flex justify-between">
				<div>
					<p class="text-lg">Archive Tenant</p>
					<p class="text-black/50">
						Remove all data related to the Tenant. You can access the data by using the archive
						filter.
					</p>
				</div>
				<form method="post" action="?/archiveTenant" use:enhance>
					{#if data.tenant?.TenantRental.find((unit) => unit.active)?.active}
						<button
							type="button"
							on:click|stopPropagation={() => toast.push('Can not delete an active Tenant.')}
							class="bg-subtitle text-white/50 hover:cursor-default rounded-md py-2 px-6"
							>Archive</button
						>
					{:else}
						<button type="submit" class="bg-danger text-white rounded-md py-2 px-6">Archive</button>
					{/if}
				</form>
			</div>
		</div>
	{/if}
</div>

{#if extendContractModal}
	<div class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
		<div
			use:clickOutside={() => (extendContractModal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<ExtendContract {form} {data} unitId={unitToExtend} />
		</div>
	</div>
{/if}

{#if endContractModal}
	<div class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
		<div
			use:clickOutside={() => (endContractModal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<EndContract {form} {data} unitId={unitToEnd} />
		</div>
	</div>
{/if}

{#if editRentedUnitModal}
	<div class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center">
		<div
			use:clickOutside={() => (editRentedUnitModal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<EditRentedUnit {form} {data} {selectedRentedUnitId} bind:editRentedUnitModal />
		</div>
	</div>
{/if}

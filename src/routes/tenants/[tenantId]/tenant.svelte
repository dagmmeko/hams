<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import Delete from '$lib/assets/delete.svg.svelte'
	import Eye from '$lib/assets/eye.svg.svelte'
	import FileBg from '$lib/assets/file-bg.png'
	import FileUp from '$lib/assets/file-up.svg.svelte'
	import { clickOutside } from '$lib/utils/click-outside'
	import { toast } from '@zerodevx/svelte-toast'
	import { superForm } from 'sveltekit-superforms/client'
	import type { ActionData, PageData } from './$types'

	import dayjs from 'dayjs'
	import EndContract from './end-contract.svelte'
	import ExtendContract from './extend-contract.svelte'
	import { uploadFiles } from '$lib/utils/upload-files'
	import EditRentedUnit from './edit-rented-unit.svelte'

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data = $bindable(), form = $bindable() }: Props = $props()
	const {
		form: editTenantForm,
		enhance: editTenantFormEnhance,
		constraints,
	} = superForm(data.editTenantForm)
	$effect.pre(() => {
		form?.editTenant ? toast.push('Tenant updated successfully') : null
	})
	$effect.pre(() => {
		form?.deleteFile ? toast.push('File deleted successfully') : null
	})
	$effect.pre(() => {
		form?.allNewFiles ? toast.push('Files uploaded successfully') : null
	})
	$effect.pre(() => {
		form?.errorMessage ? toast.push(form.errorMessage) : null
	})
	$effect.pre(() => {
		form?.fileUrl ? window.open(form?.fileUrl, '_blank') : null
	})
	$effect.pre(() => {
		console.log(form?.fileUrl)
	})

	let extendContractModal = $state(false)
	let unitToExtend: any = $state()
	let endContractModal = $state(false)
	let unitToEnd: any = $state()
	let fileNames: string[] = $state([])
	let editRentedUnitModal = $state(false)
	let selectedRentedUnitId: any = $state()
</script>

<div class=" mt-6 rounded-md border-[1px] border-black/20 bg-white p-6 shadow-sm">
	<form use:editTenantFormEnhance method="post" action="?/editTenant">
		<div class="grid-flow-col justify-items-stretch md:grid">
			<div class="grid">
				<p class="text-2xl">Tenant Info</p>
				<p class=" rounded-xl py-1 text-sm">Tenant details here.</p>
			</div>
			{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_TENANT')}
				<div class="justify-self-end">
					<button type="submit" class="rounded-md bg-primary px-6 py-2 text-white">
						Update Info
					</button>
				</div>
			{/if}
		</div>
		<hr class="my-6" />
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Full Name</span>
				<input
					name="fullName"
					bind:value={$editTenantForm.fullName}
					{...$constraints.fullName}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Phone Number</span>
				<input
					name="phoneNumber"
					bind:value={$editTenantForm.phoneNumber}
					{...$constraints.phoneNumber}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Email </span>
				<input name="email" bind:value={$editTenantForm.email} {...$constraints.email} class="" />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Emergency Contact Name</span>
				<input
					name="emergencyContactName"
					bind:value={$editTenantForm.emergencyContactName}
					{...$constraints.emergencyContactName}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Emergency Contact Phone </span>
				<input
					name="emergencyContactPhoneNumber"
					bind:value={$editTenantForm.emergencyContactPhoneNumber}
					{...$constraints.emergencyContactPhoneNumber}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Emergency Contact Email</span>
				<input
					name="emergencyContactEmail"
					bind:value={$editTenantForm.emergencyContactEmail}
					{...$constraints.emergencyContactEmail}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Passport Number</span>
				<input
					name="passportNumber"
					bind:value={$editTenantForm.passportNumber}
					{...$constraints.passportNumber}
					class=""
				/>
			</label>
		</div>
	</form>
	<div class="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
		<div>
			<div class="mb-1 w-full text-xl font-medium">Active Rooms</div>
			<hr class="mb-1" />
			<div class="h-60 overflow-y-auto">
				{#each data.tenant?.TenantRental ?? [] as tenantUnit}
					{#if tenantUnit.active && tenantUnit.exitingTenant === false}
						<div class="mb-3 w-full rounded-md bg-primary/10 p-2 shadow-md">
							<button
								onclick={() => {
									editRentedUnitModal = true
									selectedRentedUnitId = tenantUnit.id
								}}
								class="w-full rounded-md border-[1px] border-black p-2 text-left"
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
										tenantUnit.contractEndDate,
									).format('MMM DD/YY')}
								</div>
							</button>

							<div class="mt-1 flex gap-2">
								{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'START_END_RENT')}
									<button
										class="rounded-md bg-orange-600 p-2 text-xs text-white"
										onclick={(e) => {
											e.preventDefault()
											endContractModal = true
											unitToExtend = tenantUnit.id
										}}
									>
										Start End Process
									</button>
								{/if}
								{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EXTEND_RENT')}
									<button
										class="rounded-md bg-info p-2 text-xs text-white"
										onclick={(e) => {
											e.preventDefault()
											extendContractModal = true
											unitToEnd = tenantUnit.id
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
			<div class="mb-4 w-full text-xl font-medium">Tenant Files</div>
			<div class="grid h-60 grid-cols-3 items-start gap-2 overflow-y-auto">
				{#each data.tenant?.TenantsFile ?? [] as file}
					<div class="rounded-lg border-[1px] border-dashed border-primary">
						<div class="relative">
							<div class=" relative z-10 h-36 w-full">
								<img src={FileBg} alt="bg" class="h-full w-full" />
							</div>

							<div class="absolute left-0 top-0 z-30 h-full w-full">
								<form
									method="post"
									action="?/downloadTenantFile"
									use:enhance={({ formData }) => {
										formData.set('tenantKey', `${file.File.key}`)
										return async ({ result, update }) => {
											await update()
											if (result.type === 'success') {
												// @ts-ignore
												// window.open(result.data.fileUrl, '_blank');
											}
										}
									}}
									class="flex h-full flex-col items-center justify-center gap-2"
								>
									<button
										onclick={(e) => {
											e.stopPropagation()
										}}
										type="submit"
									>
										<div class="flex h-full w-full flex-col items-center justify-center">
											<Eye class="h-7 w-7 text-primary" />
											<span class="mx-3 break-all py-2 text-sm">
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
								formData.set('tenantFileId', `${file.fileId}`)
							}}
						>
							<button
								onclick={(e) => {
									e.stopPropagation()
								}}
								class="flex w-full items-center justify-center gap-1 p-2"
							>
								<Delete class="h-5 w-5 text-danger" />
								<span class="text-sm text-danger">Delete</span>
							</button>
						</form>
					</div>
				{/each}
				<div
					class="relative max-h-96 w-full flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
				>
					<form
						method="post"
						action="?/editTenantFile"
						use:enhance={({ formData }) => {
							formData.set('fileNames', fileNames.join(','))
							formData.set('tenantFile', 'Files')
						}}
						enctype="multipart/form-data"
					>
						<label>
							<input
								class="hidden"
								type="file"
								name="tenantFile"
								multiple
								onchange={async (e) => {
									const uploadPromises = []
									const cal = e.currentTarget.form
									for (const file of e.currentTarget.files ?? []) {
										uploadPromises.push(
											(async function () {
												if (data.tenant) {
													fileNames = [...fileNames, file.name]
													return await uploadFiles(
														file,
														`tenantsFile/${data.tenant.id}/${file.name}`,
													)
												}
											})(),
										)
									}
									const successes = await Promise.all(uploadPromises)

									if (!successes.find((s) => s !== true)) {
										// @ts-ignore
										cal.requestSubmit()
									}
								}}
							/>

							<div class=" relative z-10 h-44"></div>
							<div class="absolute left-0 top-0 z-30 h-full w-full">
								<div class="flex h-full flex-col items-center justify-center gap-2">
									<FileUp class="h-7 w-7 text-primary" />
									<span class="text-xs">Upload File</span>
									<p class="px-3 text-center text-[10px]">
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
	{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_TENANT')}
		<p class="mt-6 text-2xl">Danger</p>
		<hr class="my-6" />

		<div class="rounded-md border-2 border-dashed border-danger p-5">
			<div class="justify-between md:flex">
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
							onclick={(e) => {
								e.stopPropagation()
								toast.push('Can not delete an active Tenant.')
							}}
							class="rounded-md bg-subtitle px-6 py-2 text-white/50 hover:cursor-default"
							>Archive</button
						>
					{:else}
						<button type="submit" class="rounded-md bg-danger px-6 py-2 text-white">Archive</button>
					{/if}
				</form>
			</div>
		</div>
	{/if}
</div>

{#if extendContractModal}
	<div class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70">
		<div
			use:clickOutside={() => (extendContractModal = false)}
			class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
		>
			<ExtendContract {form} {data} unitId={unitToExtend} />
		</div>
	</div>
{/if}

{#if endContractModal}
	<div class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70">
		<div
			use:clickOutside={() => (endContractModal = false)}
			class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
		>
			<EndContract {form} {data} unitId={unitToEnd} />
		</div>
	</div>
{/if}

{#if editRentedUnitModal}
	<div class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70">
		<div
			use:clickOutside={() => (editRentedUnitModal = false)}
			class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
		>
			<EditRentedUnit {form} {data} {selectedRentedUnitId} bind:editRentedUnitModal />
		</div>
	</div>
{/if}

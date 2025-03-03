<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client'
	import Delete from '$lib/assets/delete.svg.svelte'
	import Eye from '$lib/assets/eye.svg.svelte'
	import FileBg from '$lib/assets/file-bg.png'
	import FileUp from '$lib/assets/file-up.svg.svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import type { PageData, ActionData } from './$types'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { uploadFiles } from '$lib/utils/upload-files'

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data = $bindable(), form = $bindable() }: Props = $props()

	const {
		form: editVendorForm,
		enhance: editFormEnhance,
		constraints,
	} = superForm(data.editVendorForm)

	$effect.pre(() => {
		form?.vendor ? toast.push('Vendor info updated') : ''
	})

	let frontFileData: string[] = []

	$effect.pre(() => {
		form?.errorMessage ? toast.push(form.errorMessage) : null
	})

	$effect.pre(() => {
		form?.deletedVendorFile ? toast.push('File deleted successfully') : null
	})
	let fileNames: string[] = $state([])
	$effect.pre(() => {
		form?.vendorArchived ? toast.push('Vendor deleted successfully') : null
	})
	$effect.pre(() => {
		form?.vendorArchived ? (window.location.href = '/vendor-task') : null
	})
</script>

<div class="p-6">
	<form use:editFormEnhance method="post" action="?/editVendorInfo">
		<div class="justify-between md:flex">
			<div class="grid">
				<p class="text-2xl">Vendor Info</p>
				<p class=" rounded-xl py-1 text-sm">Vendor details here.</p>
			</div>
			{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_VENDOR')}
				<button
					type="submit"
					onclick={(e) => {
						e.stopPropagation()
					}}
					class="rounded-md bg-primary px-6 py-2 text-white"
				>
					Update Info</button
				>
			{/if}
		</div>
		<hr class="my-6" />
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Vendor Name</span>
				<input name="name" bind:value={$editVendorForm.name} {...$constraints.name} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Contact number</span>
				<input
					name="phoneNumber"
					bind:value={$editVendorForm.phoneNumber}
					{...$constraints.phoneNumber}
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Address</span>
				<input name="address" bind:value={$editVendorForm.address} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Service Type </span>
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
				<span class="py-1 font-semibold text-primary"> Email</span>
				<input name="email" bind:value={$editVendorForm.email} {...$constraints.email} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Score</span>
				<input name="score" bind:value={$editVendorForm.score} />
			</label>
		</div>
		<div class="mt-4">
			<label class="grid">
				<span class="py-1 font-semibold text-primary"> Description</span>
				<textarea
					class="max-w-md rounded-md border-[1px] border-[#3b82f6]/30 p-2"
					name="serviceDescription"
					bind:value={$editVendorForm.serviceDescription}
					{...$constraints.serviceDescription}
				></textarea>
			</label>
		</div>
	</form>

	<!-- File display section moved outside main form -->
	<div class=" mb-8 flex w-full flex-1 flex-shrink-0 flex-wrap items-start gap-2 p-4">
		{#each data.vendor.VendorFile ?? [] as file}
			<div class="w-[180px] rounded-lg border-[1px] border-dashed border-primary">
				<div class="relative">
					<div class=" relative z-10 h-36 w-full">
						<img src={FileBg} alt="bg" class="h-full w-full" />
					</div>

					<div class="absolute left-0 top-0 z-30 h-full w-full">
						<div class="flex h-full flex-col items-center justify-center gap-2">
							<form
								id="downloadVendorFile"
								method="post"
								action="?/downloadVendorFile"
								use:enhance={({ formData }) => {
									formData.set('vendorFileKey', `${file.File.key}`)
								}}
							>
								<button
									onclick={(e) => {
										e.stopPropagation()
									}}
									type="submit"
								>
									<div class="flex h-full flex-col items-center justify-center">
										<Eye class="h-7 w-7 text-primary" />
										<p class="ml-2 line-clamp-1 flex-1 py-2 text-sm">{file.File.fileName}</p>
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
						formData.set('deleteVendorFileId', `${file.fileId}`)
						return async ({ result, update }) => {
							if (result.type === 'success') {
								// @ts-ignore
								window.open(result.data.fileUrl, '_blank')
							}
						}
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
			class="relative max-h-96 max-w-[180px] flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
		>
			<form
				id="editVendorFile"
				method="post"
				action="?/editVendorFile"
				use:enhance={({ formData }) => {
					formData.set('fileNames', fileNames.join(','))
					formData.set('vendorFile', 'Files')
				}}
				enctype="multipart/form-data"
			>
				<label>
					<input
						class="hidden"
						type="file"
						name="vendorFile"
						multiple
						onchange={async (e) => {
							const uploadPromises = []
							const cal = e.currentTarget.form
							for (const file of e.currentTarget.files ?? []) {
								uploadPromises.push(
									(async function () {
										if (data.vendor) {
											fileNames = [...fileNames, file.name]

											return await uploadFiles(file, `vendorFile/${data.vendor.id}/${file.name}`)
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
								Contract, Agreement, pictures or any other document
							</p>
						</div>
					</div>
				</label>
			</form>
		</div>
	</div>

	{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_VENDOR')}
		<p class="mt-10 text-2xl">Danger</p>
		<hr class="my-6" />

		<div class="rounded-md border-2 border-dashed border-danger p-5">
			<div class="justify-between md:flex">
				<div>
					<p class="text-lg">Delete Vendor</p>
					<p class="text-black/50">
						Remove all data related to vendor.Once you take this action their is no going back
					</p>
				</div>
				<form
					method="post"
					action="?/archiveVendor"
					use:enhance={({ cancel }) => {
						if (!window.confirm('Are you sure you want to delete this Vendor?')) {
							cancel()
						}
					}}
				>
					<button class="flex items-center rounded-md bg-danger p-4 text-white">
						<Delete /> Delete Vendor
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>

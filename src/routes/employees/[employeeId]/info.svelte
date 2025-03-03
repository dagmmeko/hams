<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client'
	import type { PageData, ActionData } from './$types'
	import { page } from '$app/stores'
	import FileUpload from '$lib/assets/file-upload.svg.svelte'
	import FileUp from '$lib/assets/file-up.svg.svelte'
	import { enhance } from '$app/forms'
	import { toast } from '@zerodevx/svelte-toast'
	import { goto } from '$app/navigation'
	import FileBg from '$lib/assets/file-bg.png'
	import { uploadFiles } from '$lib/utils/upload-files'
	import Eye from '$lib/assets/eye.svg.svelte'
	import Delete from '$lib/assets/delete.svg.svelte'

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data = $bindable(), form = $bindable() }: Props = $props()
	const {
		form: editEmployeeForm,
		enhance: editFormEnhance,
		constraints,
	} = superForm(data.editEmployeeForm)

	const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' })
	const birthDate = dateProxy(editEmployeeForm, 'dob', { format: 'date', empty: 'undefined' })
	let frontFileData: string[] = []
	let fileNames: string[] = $state([])

	$effect.pre(() => {
		form?.employeeArchived ? toast.push('Employee archived successfully') : null
	})
	$effect.pre(() => {
		form?.employeeArchived ? goto('/employees') : null
	})
</script>

<div class="p-6">
	<form use:editFormEnhance method="post" action="?/editEmployeeInfo">
		<div class="justify-between md:flex">
			<div class="grid">
				<p class="text-2xl">Employee Info</p>
				<p class=" rounded-xl py-1 text-sm">Employee personal and performance details here.</p>
			</div>
			{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_EMPLOYEE')}
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
				<span class="py-1 font-semibold text-primary"> Full Name</span>
				<input name="userName" bind:value={$editEmployeeForm.userName} {...$constraints.userName} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Phone number</span>
				<input
					name="phoneNumber"
					bind:value={$editEmployeeForm.phoneNumber}
					{...$constraints.phoneNumber}
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Employment Type </span>
				<select
					name="employmentType"
					bind:value={$editEmployeeForm.employmentType}
					{...$constraints.employmentType}
				>
					<option selected disabled value={null}>Select Employment Type</option>
					<option value="FULL_TIME">Full Time</option>
					<option value="PART_TIME">Part Time</option>
					<option value="TEMPORARY">Contract</option>
				</select>
			</label>
			<div class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Attendance</span>
				<div>
					{data.employee.isAbsent
						? 'Absent'
						: data.employee.isSuspended
							? 'Suspended'
							: data.employee.isFired
								? 'Fired'
								: data.employee.onLeave
									? 'On Leave'
									: 'Present'}
				</div>
			</div>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Email</span>
				<input name="email" bind:value={$editEmployeeForm.email} {...$constraints.email} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Role</span>
				<select name="roleId" bind:value={$editEmployeeForm.roleId} {...$constraints.roleId}>
					<option selected disabled> Select Role </option>
					{#each data.roles as role}
						<option value={role.id}> {role.name} </option>
					{/each}
				</select>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Date of Employment </span>
				<input type="date" name="hiredDate" bind:value={$hireDate} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Head of Department</span>
				<select
					name="managerId"
					bind:value={$editEmployeeForm.managerId}
					{...$constraints.managerId}
				>
					<option selected disabled> Select Employee </option>
					{#each data.allEmployees as employee}
						<option value={employee.User.id}>
							{employee.User.userName} - ({employee.Role.name})
						</option>
					{/each}
				</select>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Date of Birth </span>
				<input type="date" name="dob" bind:value={$birthDate} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Blood Type</span>
				<input
					name="bloodType"
					bind:value={$editEmployeeForm.bloodType}
					{...$constraints.bloodType}
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Height</span>
				<input name="height" bind:value={$editEmployeeForm.height} {...$constraints.height} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Job Title</span>
				<input name="jobTitle" bind:value={$editEmployeeForm.jobTitle} {...$constraints.jobTitle} />
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Emergency Contact Name</span>
				<input
					name="emergencyContactName"
					bind:value={$editEmployeeForm.emergencyContactName}
					{...$constraints.emergencyContactName}
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Emergency Contact Email</span>
				<input
					name="emergencyContactEmail"
					bind:value={$editEmployeeForm.emergencyContactEmail}
					{...$constraints.emergencyContactEmail}
				/>
			</label><label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Emergency Contact Phone</span>
				<input
					name="emergencyContactPhoneNumber"
					bind:value={$editEmployeeForm.emergencyContactPhoneNumber}
					{...$constraints.emergencyContactPhoneNumber}
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Surety's Name</span>
				<input
					name="suretyName"
					bind:value={$editEmployeeForm.suretyName}
					{...$constraints.suretyName}
				/>
			</label>
			<label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Surety's Address</span>
				<input
					name="suretyAddress"
					bind:value={$editEmployeeForm.suretyAddress}
					{...$constraints.suretyAddress}
				/>
			</label><label class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Surety's Phone Number</span>
				<input
					name="suretyPhoneNumber"
					bind:value={$editEmployeeForm.suretyPhoneNumber}
					{...$constraints.suretyPhoneNumber}
				/>
			</label>
		</div>
	</form>
	<p class="mt-10 text-2xl">Documents</p>
	<hr class="my-6" />
	<div class="  my-8 flex w-full flex-1 flex-shrink-0 flex-wrap items-start gap-2">
		{#each data.employee.EmployeeFile ?? [] as file}
			<div class="w-[180px] rounded-lg border-[1px] border-dashed border-primary">
				<div class="relative">
					<div class=" relative z-10 h-36 w-full">
						<img src={FileBg} alt="bg" class="h-full w-full" />
					</div>

					<div class="absolute left-0 top-0 z-30 h-full w-full">
						<form
							id="downloadEmployeeFile"
							method="post"
							action="?/downloadEmployeeFile"
							use:enhance={({ formData }) => {
								formData.set('employeeKey', `${file.File.key}`)
								return async ({ result }) => {
									if (result.type === 'success') {
										// @ts-ignore
										window.open(result.data.fileUrl, '_blank')
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
					id="deleteEmployeeFile"
					method="post"
					action="?/deleteEmployeeFile"
					use:enhance={({ formData, cancel }) => {
						if (!window.confirm('Are you sure you want to delete this file?')) {
							cancel()
						}
						formData.set('employeeFileId', `${file.fileId}`)
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
			class="relative max-w-[180px] flex-1 flex-shrink-0 items-center justify-center rounded-lg border-[1px] border-dashed border-primary"
		>
			<form
				method="post"
				action="?/editEmployeeFile"
				use:enhance={({ formData }) => {
					formData.set('fileNames', fileNames.join(','))
					formData.set('employeeFiles', 'Files')
				}}
				enctype="multipart/form-data"
			>
				<label>
					<input
						class="hidden"
						type="file"
						name="employeeFiles"
						multiple
						onchange={async (e) => {
							const uploadPromises = []
							const cal = e.currentTarget.form
							for (const file of e.currentTarget.files ?? []) {
								uploadPromises.push(
									(async function () {
										if (data.employee) {
											fileNames = [...fileNames, file.name]
											return await uploadFiles(
												file,
												`employeeFiles/${data.employee.id}/${file.name}`,
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

					<div class=" relative z-10 h-44 w-32"></div>
					<div class="absolute left-0 top-0 z-30 h-full w-full">
						<div class="flex h-full flex-col items-center justify-center gap-2">
							<FileUp class="h-7 w-7 text-primary" />
							<span class="text-xs">Upload File</span>
						</div>
					</div>
				</label>
			</form>
		</div>
	</div>
	{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_EMPLOYEE')}
		<p class="mt-10 text-2xl">Danger</p>
		<hr class="my-6" />

		<div class="rounded-md border-2 border-dashed border-danger p-5">
			<!-- <div class="md:flex justify-between">
				<div>
					<p class="text-lg">Suspend Employee</p>
					<p class="text-black/50">Suspend employee from job for a given time.</p>
				</div>
				<button class="bg-danger text-white rounded-md py-2 px-6">Suspend</button>
			</div> -->
			<div class="justify-between md:flex">
				<div>
					<p class="text-lg">Archive Employee</p>
					<p class="text-black/50">Archive employment contract with employee.</p>
				</div>
				<form
					method="post"
					action="?/archiveEmployee"
					use:enhance={({ cancel }) => {
						if (!window.confirm('Are you sure you want to Fire this Employee?')) {
							cancel()
						}
					}}
				>
					<button class="rounded-md bg-danger px-6 py-2 text-white">Archive</button>
				</form>
			</div>
		</div>
	{/if}
</div>

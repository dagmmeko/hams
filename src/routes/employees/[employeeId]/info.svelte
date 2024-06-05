<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData, ActionData } from './$types';
	import { page } from '$app/stores';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import { enhance } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import FileBg from '$lib/assets/file-bg.png';
	import { uploadFiles } from '$lib/utils/upload-files';
	import Eye from '$lib/assets/eye.svg.svelte';
	import Delete from '$lib/assets/delete.svg.svelte';

	export let data: PageData;
	export let form: ActionData;
	const {
		form: editEmployeeForm,
		enhance: editFormEnhance,
		constraints
	} = superForm(data.editEmployeeForm);

	const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' });
	const birthDate = dateProxy(editEmployeeForm, 'dob', { format: 'date', empty: 'undefined' });
	let frontFileData: string[] = [];
	let fileNames: string[] = [];

	$: form?.employeeArchived ? toast.push('Employee archived successfully') : null;
	$: form?.employeeArchived ? goto('/employees') : null;
	$: form?.fileUrl ? window.open(form.fileUrl, '_blank') : null;
</script>

<div class="p-6">
	<form use:editFormEnhance method="post" action="?/editEmployeeInfo">
		<div class="md:flex justify-between">
			<div class="grid">
				<p class="text-2xl">Employee Info</p>
				<p class=" text-sm py-1 rounded-xl">Employee personal and performance details here.</p>
			</div>
			{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_EMPLOYEE')}
				<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 px-6">
					Update Info</button
				>
			{/if}
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Full Name</span>
				<input name="userName" bind:value={$editEmployeeForm.userName} {...$constraints.userName} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Phone number</span>
				<input
					name="phoneNumber"
					bind:value={$editEmployeeForm.phoneNumber}
					{...$constraints.phoneNumber}
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Employment Type </span>
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
				<span class="text-primary font-semibold py-1"> Attendance</span>
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
				<span class="text-primary font-semibold py-1"> Email</span>
				<input name="email" bind:value={$editEmployeeForm.email} {...$constraints.email} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Role</span>
				<select name="roleId" bind:value={$editEmployeeForm.roleId} {...$constraints.roleId}>
					<option selected disabled> Select Role </option>
					{#each data.roles as role}
						<option value={role.id}> {role.name} </option>
					{/each}
				</select>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Date of Employment </span>
				<input type="date" name="hiredDate" bind:value={$hireDate} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Head of Department</span>
				<select
					name="managerId"
					bind:value={$editEmployeeForm.managerId}
					{...$constraints.managerId}
				>
					<option selected disabled> Select Employee </option>
					{#each data.allEmployees as employee}
						<option value={employee.User.id}>
							{employee.User.userName}
							<span class="text-xs">({employee.Role.name})</span>
						</option>
					{/each}
				</select>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Date of Birth </span>
				<input type="date" name="dob" bind:value={$birthDate} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Blood Type</span>
				<input
					name="bloodType"
					bind:value={$editEmployeeForm.bloodType}
					{...$constraints.bloodType}
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Height</span>
				<input name="height" bind:value={$editEmployeeForm.height} {...$constraints.height} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Job Title</span>
				<input name="jobTitle" bind:value={$editEmployeeForm.jobTitle} {...$constraints.jobTitle} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Name</span>
				<input
					name="emergencyContactName"
					bind:value={$editEmployeeForm.emergencyContactName}
					{...$constraints.emergencyContactName}
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Email</span>
				<input
					name="emergencyContactEmail"
					bind:value={$editEmployeeForm.emergencyContactEmail}
					{...$constraints.emergencyContactEmail}
				/>
			</label><label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Emergency Contact Phone</span>
				<input
					name="emergencyContactPhoneNumber"
					bind:value={$editEmployeeForm.emergencyContactPhoneNumber}
					{...$constraints.emergencyContactPhoneNumber}
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Surety's Name</span>
				<input
					name="suretyName"
					bind:value={$editEmployeeForm.suretyName}
					{...$constraints.suretyName}
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Surety's Address</span>
				<input
					name="suretyAddress"
					bind:value={$editEmployeeForm.suretyAddress}
					{...$constraints.suretyAddress}
				/>
			</label><label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Surety's Phone Number</span>
				<input
					name="suretyPhoneNumber"
					bind:value={$editEmployeeForm.suretyPhoneNumber}
					{...$constraints.suretyPhoneNumber}
				/>
			</label>
		</div>
	</form>
	<p class="text-2xl mt-10">Documents</p>
	<hr class="my-6" />
	<div class="  w-full my-8 flex-1 flex-shrink-0 flex flex-wrap items-start gap-2">
		{#each data.employee.EmployeeFile ?? [] as file}
			<div class="border-[1px] w-[180px] border-primary border-dashed rounded-lg">
				<div class="relative">
					<div class=" relative z-10 w-full h-36">
						<img src={FileBg} alt="bg" class="w-full h-full" />
					</div>

					<div class="absolute top-0 w-full h-full left-0 z-30">
						<form
							id="downloadEmployeeFile"
							method="post"
							action="?/downloadEmployeeFile"
							use:enhance={({ formData }) => {
								formData.set('employeeKey', `${file.File.key}`);
							}}
							class="flex flex-col gap-2 justify-center items-center h-full"
						>
							<button on:click|stopPropagation={() => console.log('download')} type="submit">
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
					id="deleteEmployeeFile"
					method="post"
					action="?/deleteEmployeeFile"
					use:enhance={({ formData, cancel }) => {
						if (!window.confirm('Are you sure you want to delete this file?')) {
							cancel();
						}
						formData.set('employeeFileId', `${file.fileId}`);
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
			class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] items-center justify-center"
		>
			<form
				method="post"
				action="?/editEmployeeFile"
				use:enhance={({ formData }) => {
					formData.set('fileNames', fileNames.join(','));
					formData.set('employeeFiles', 'Files');
				}}
			>
				<label>
					<input
						class="hidden"
						type="file"
						name="employeeFiles"
						multiple
						on:change={async (e) => {
							const uploadPromises = [];
							const cal = e.currentTarget.form;
							for (const file of e.currentTarget.files ?? []) {
								uploadPromises.push(
									(async function () {
										if (data.employee) {
											fileNames = [...fileNames, file.name];
											return await uploadFiles(
												file,
												`employeeFiles/${data.employee.id}/${file.name}`
											);
										}
									})()
								);
							}
							const successes = await Promise.all(uploadPromises);

							if (!successes.find((s) => s !== true)) {
								console.log('submitting');
								// @ts-ignore
								cal.requestSubmit();
							}
						}}
					/>

					<div class=" relative z-10 w-32 h-44" />
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
	{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_EMPLOYEE')}
		<p class="text-2xl mt-10">Danger</p>
		<hr class="my-6" />

		<div class="border-2 border-danger border-dashed rounded-md p-5">
			<!-- <div class="md:flex justify-between">
				<div>
					<p class="text-lg">Suspend Employee</p>
					<p class="text-black/50">Suspend employee from job for a given time.</p>
				</div>
				<button class="bg-danger text-white rounded-md py-2 px-6">Suspend</button>
			</div> -->
			<div class="md:flex justify-between">
				<div>
					<p class="text-lg">Archive Employee</p>
					<p class="text-black/50">Archive employment contract with employee.</p>
				</div>
				<form
					method="post"
					action="?/archiveEmployee"
					use:enhance={({ cancel }) => {
						if (!window.confirm('Are you sure you want to Fire this Employee?')) {
							cancel();
						}
					}}
				>
					<button class="bg-danger text-white rounded-md py-2 px-6">Archive</button>
				</form>
			</div>
		</div>
	{/if}
</div>

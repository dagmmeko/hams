<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import QR from '$lib/assets/qr.png';

	export let data: PageData;
	const {
		form: editEmployeeForm,
		enhance: editFormEnhance,
		constraints
	} = superForm(data.editEmployeeForm);

	const hireDate = dateProxy(editEmployeeForm, 'hiredDate', { format: 'date', empty: 'undefined' });
	const birthDate = dateProxy(editEmployeeForm, 'dob', { format: 'date', empty: 'undefined' });
</script>

<div class="p-6">
	<form use:editFormEnhance method="post" action="?/editEmployeeInfo">
		<div class="flex justify-between">
			<div class="grid">
				<p class="text-2xl">Employee Info</p>
				<p class=" text-sm py-1 rounded-xl">Employee personal and performance details here.</p>
			</div>
			<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 px-6">
				Update Info</button
			>
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 grid-cols-4">
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
					<option selected disabled>Select Employment Type</option>
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
				<span class="text-primary font-semibold py-1"> Manager</span>
				<select
					name="managerId"
					bind:value={$editEmployeeForm.managerId}
					{...$constraints.managerId}
				>
					<option selected disabled> Select Role </option>
					{#each data.allEmployees as employee}
						<option value={employee.User.id}> {employee.User.userName} </option>
					{/each}
				</select>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Date of Birth </span>
				<input type="date" name="dob" bind:value={$birthDate} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Blood Type</span>
				<input name="bloodType" bind:value={$editEmployeeForm.bloodType} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Height</span>
				<input name="height" bind:value={$editEmployeeForm.height} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Job Title</span>
				<input name="jobTitle" bind:value={$editEmployeeForm.jobTitle} />
			</label>
		</div>
	</form>
	<p class="text-2xl mt-10">Documents</p>
	<hr class="my-6" />
	<div>
		<img src={QR} alt="qr" />
	</div>

	<p class="text-2xl mt-10">Danger</p>
	<hr class="my-6" />

	<div class="border-2 border-danger border-dashed rounded-md p-5">
		<div class="flex justify-between">
			<div>
				<p class="text-lg">Suspend Employee</p>
				<p class="text-black/50">Suspend employee from job for a given time.</p>
			</div>
			<button class="bg-danger text-white rounded-md py-2 px-6">Suspend</button>
		</div>
		<div class="flex mt-6 justify-between">
			<div>
				<p class="text-lg">Archive Employee</p>
				<p class="text-black/50">Archive employment contract with employee.</p>
			</div>
			<button class="bg-danger text-white rounded-md py-2 px-6">Archive</button>
		</div>
	</div>
</div>

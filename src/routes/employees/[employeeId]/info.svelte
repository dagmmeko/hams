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
</script>

<div class="p-6">
	<div class="flex justify-between">
		<div class="grid">
			<p class="text-2xl">Employee Info</p>
			<p class=" text-sm py-1 rounded-xl">Employee personal and performance details here.</p>
		</div>
		<button class="bg-primary text-white rounded-md py-2 px-6"> Update Info</button>
	</div>
	<hr class="my-6" />
	<div class="grid gap-6 grid-cols-4">
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Full Name</span>
			<input
				name="userName"
				bind:value={$editEmployeeForm.userName}
				{...$constraints.userName}
				class=""
			/>
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Phone number</span>
			<input
				name="phoneNumber"
				bind:value={$editEmployeeForm.phoneNumber}
				{...$constraints.phoneNumber}
			/>
		</label>
		<div class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Status </span>
			<div>{data.employee.EmployeeStatus}</div>
		</div>
		<div class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Attendance</span>
			<div>Present</div>
		</div>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Email</span>
			<input name="email" bind:value={$editEmployeeForm.email} />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Role</span>
			<input />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Hired Date</span>
			<input type="date" name="hiredDate" bind:value={$hireDate} />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Manager</span>
			<input />
		</label>
	</div>

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

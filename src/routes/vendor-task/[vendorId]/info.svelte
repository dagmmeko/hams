<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import QR from '$lib/assets/qr.png';
	export let data: PageData;
	const {
		form: editVendorForm,
		enhance: editFormEnhance,
		constraints
	} = superForm(data.editVendorForm);

	const CreatedAt = dateProxy(editVendorForm, 'CreatedAt', { format: 'date', empty: 'undefined' });
	
</script>

<div class="p-6">
	<form use:editFormEnhance method="post" action="?/editEmployeeInfo">
		<div class="flex justify-between">
			<div class="grid">
				<p class="text-2xl">Vendor Info</p>
				<p class=" text-sm py-1 rounded-xl">Vendor details here.</p>
			</div>
			<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2 px-6">
				Update Info</button
			>
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 grid-cols-4">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Vendor Name</span>
				<input name="userName" bind:value={$editVendorForm.name} {...$constraints.name} />
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
				<span class="text-primary font-semibold py-1"> Status</span>
				<input name="status" bind:value={$editVendorForm.name} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Service Type </span>
				<select
					name="employmentType"
					bind:value={$editVendorForm.ServiceType}
					{...$constraints.ServiceType}
				>
					<option selected disabled>Select Employment Type</option>
					<option value="CLEANING">Full Time</option>
					<option value="ELECTRICITY">Part Time</option>
					<option value="PLUMBING">Contract</option>
					<option value="PAINTING">Contract</option>
					<option value="SECURITY">Contract</option>
				</select>
			</label>

			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Email</span>
				<input name="email" bind:value={$editVendorForm.email} {...$constraints.email} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Score</span>
				<input name="height" bind:value={$editVendorForm.score} />
			</label>

			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Created At</span>
				<input type="date" name="hiredDate" bind:value={$CreatedAt} />
			</label>			
			
				<br>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Contract Files</span>
			<input type="file" name ="" alt= "contract files"/>

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

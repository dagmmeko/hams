<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import Delete from '$lib/assets/delete.svg.svelte';
	import QR from '$lib/assets/qr.png';
	import Vendors from '../vendors.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import type { ActionData } from './$types';
	export let data;

	export let form: ActionData;

	const {
		form: editVendorForm,
		enhance: editFormEnhance,
		constraints
	} = superForm(data.editVendorForm);

	$: form?.vendor
		? toast.push('Vendor info updated', { theme: { '--toastBackground': '#059669' } })
		: '';
</script>

<div class="p-6">
	<form use:editFormEnhance method="post" action="?/editVendorInfo">
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
	</form>

	<p class="text-2xl mt-10">Danger</p>
	<hr class="my-6" />

	<div class="border-2 border-danger border-dashed rounded-md p-5">
		<div class="flex justify-between">
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
</div>

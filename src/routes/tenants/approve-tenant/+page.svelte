<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	export let data;
	export let form;
	let selectedUnit: any;
	let selectedTenant: any;

	let dateInput: any;
	let dateInput2: any;

	let priceChangeId: any = $page.url.searchParams.get('priceChangeId');

	$: form?.tenant ? goto('/tenants') : null;
	$: form?.tenant ? toast.push('Tenant Rented') : null;
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Tenants / Rent Room</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<form
			use:enhance={({ formData }) => {
				formData.set('priceChangeId', priceChangeId);
			}}
			method="post"
			action="?/rentApprovedRoom"
		>
			<div class="">
				<p class="text-2xl font-medium">Approved Discount</p>
				<p class="text-sm py-2">Fill out the details and rent the unit.</p>
				<button class="bg-primary text-white rounded-md py-2 px-6 w-[420px] mt-6">
					Rent Room</button
				>
			</div>

			<div class="grid grid-cols-2 mt-6">
				<div class="grid gap-4">
					<label class="grid gap-2">
						<span class="text-primary font-medium"> Purpose of Rent </span>
						<input
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
							required
							name="purposeOfRent"
						/>
					</label>
					<label class="grid">
						<span class="text-primary font-medium"> Start Date </span>
						<input
							type="date"
							name="startDate"
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
							bind:this={dateInput}
							on:click={() => {
								dateInput && dateInput.showPicker();
							}}
						/>
					</label>
				</div>
				<div class="grid gap-4">
					<label class="grid gap-2">
						<span class="text-primary font-medium"> Duration of stay </span>
						<input
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
							required
							name="duration"
						/>
					</label>
					<label class="grid">
						<span class="text-primary font-medium"> End Date </span>
						<input
							type="date"
							name="endDate"
							class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
							bind:this={dateInput2}
							on:click={() => {
								dateInput2 && dateInput2.showPicker();
							}}
						/>
					</label>
				</div>
			</div>
		</form>
	</div>
</div>

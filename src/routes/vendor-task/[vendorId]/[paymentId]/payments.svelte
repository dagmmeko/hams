<script lang="ts">
	import {superForm } from 'sveltekit-superforms/client';
	import Delete from '$lib/assets/delete.svg.svelte';
	import { clickOutside } from '$lib/utils/click-outside';
	
	export let data;
	

	
	let modal = false;
	
	const {
		form: editPaymentForm,
		enhance: editPaymentFormEnhance,
		constraints
	} = superForm(data.editPaymentForm, {
		onUpdate: () => {
			modal = false;
		}
	});


</script>

<div class="p-6">
	<form use:editPaymentFormEnhance method="post" action="?/editEmployeeInfo">
		<div class="flex justify-between">
			<div class="grid">
				<p class="text-2xl">Payment Details</p>
				<p class=" text-sm py-1 rounded-xl">Payment details and invoice here.</p>
			</div>
			<button on:click={() => (modal = true)} class="bg-primary text-white rounded-md py-2 px-6">
				Update Info</button
			>
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 grid-cols-4">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1">Lable</span>
				<input name="userName" bind:value={$editPaymentForm.name} {...$constraints.name} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1">Amount</span>
				<input
					name="phoneNumber"
					bind:value={$editPaymentForm.phoneNumber}
					{...$constraints.phoneNumber}
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Ref ID</span>
				<input name="status" bind:value={$editPaymentForm.name} />
			</label>
		
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Vendor</span>
				<input name="email" bind:value={$editPaymentForm.email} {...$constraints.email} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1">Via Bank</span>
				<input name="height" bind:value={$editPaymentForm.score} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1">Deposit Account No.</span>
				<input name="height" bind:value={$editPaymentForm.score} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1">Pay Date</span>
				<input name="height" bind:value={$editPaymentForm.score} />
			</label>
				
				
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1">Payment slip file</span>
				<input name="height" bind:value={$editPaymentForm.score} />
			</label>
				
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1">Invoice file</span>
				<input name="height" bind:value={$editPaymentForm.score} />
			</label>
				
		
			
		</div>

	</form>

	<p class="text-2xl mt-10">Danger</p>
	<hr class="my-6" />

	<div class="border-2 border-danger border-dashed rounded-md p-5">
		<div class="flex justify-between">
			<div>
				<p class="text-lg">Delete Payment</p>
				<p class="text-black/50">Remove all data related to Payment.Once you take this action their is no going back</p>
			</div>
			<button class="bg-danger flex text-white rounded-md py-2 px-6"><Delete/> Delete payment</button>
		</div>

	</div>
</div>


{#if modal}
	<form
		use:editPaymentFormEnhance
		class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"
		method="post"
		action="?/addPayment"
	>
		<div
			use:clickOutside={() => (modal = false)}
			class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"
		>
			<div>
				<p class="text-xl font-semibold">Update Payment</p>
				<p class="text-sm text-subtitle pt-2">
					Update payment here. Click save when your done
				</p>
			</div>
			<label class="grid">
				<span class="text-primary font-medium"> Label </span>
				<input
					bind:value={$editPaymentForm.label}
					name="Label"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<label class="grid">
				<span class="text-primary font-medium"> Amount</span>
				<input
					bind:value={$editPaymentForm.amount}
					name="phoneNumber"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			<!--
			<label class="grid">
				<span class="text-primary font-medium"> Ref ID</span>
				<input
					bind:value={$addPaymentForm.vendorTaskId}
					{...$constraints.email}
					name="email"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
	
			<label class="grid">
				<span class="text-primary font-medium"> Deposit account</span>
				<input
					bind:value={$addPaymentForm.AAAA}
					name="address"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>

				-->
				
			<label class="grid">
				<span class="text-primary font-medium"> Via Bank</span>
				<input
					bind:value={$editPaymentForm.despositedToBank}
					name="serviceDescription"
					required
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
				/>
			</label>
			
			
			<button on:click|stopPropagation class="bg-primary text-white rounded-md py-2">
				Update Payment
			</button>
		</div>
	</form>
{/if}


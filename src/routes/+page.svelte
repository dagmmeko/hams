<script>
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	export let form;

	const { form: usdRateForm, enhance, constraints } = superForm(data.usdRateForm);
	$: form?.updatedRate ? toast.push('Rate updated successfully') : null;
</script>

<div class="mx-10 my-12">
	<form use:enhance method="post" action="?/changeRate">
		<label class="grid">
			<span class="text-primary font-semibold py-1"> USD Rate</span>
			<input
				class="w-24 border-[1px] border-black/60 rounded-md p-1"
				name="usdRate"
				bind:value={$usdRateForm.usdRate}
				{...$constraints.usdRate}
			/>
		</label>
		<label class="hidden">
			<input name="id" bind:value={$usdRateForm.id} {...$constraints.id} />
		</label>
		<button type="submit" class="bg-primary h-fit text-sm p-1 rounded-md mt-2 text-white"
			>Save</button
		>
	</form>
	<div class="my-6">
		<p class="text-2xl font-medium text-primary">General Statistics</p>
	</div>
	<div class=" grid grid-cols-4 gap-4">
		<div class="bg-white border-[1px] border-subtitle p-3 grid rounded-sm text-center">
			<span>Occupancy rates</span>
			<span>{data.activeUnit} / {data.allUnits}</span>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Bookings by source
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Upcoming reservations
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">unit status</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			employee on leave
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			employees absent
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			employee status
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			vendor active tasks
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			vendor completed tasks
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">vendor types</div>
	</div>
</div>

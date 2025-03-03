<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	import { toast } from '@zerodevx/svelte-toast';
	interface Props {
		data: PageData;
		form: ActionData;
		unitId: string | undefined;
	}

	let { data, form, unitId }: Props = $props();
	let dateInput: any = $state();

	const {
		form: extendContractForm,
		enhance,
		constraints
	} = superForm(data.extendRentForm, {
		onSubmit: ({ formData, cancel }) => {
			if (unitId) {
				formData.set('unitRenalId', unitId);
			} else {
				toast.push('Unit not found');
				cancel();
			}
		}
	});

	$effect.pre(() => {
		form?.updateEndDate ? toast.push('Rent extended successfully') : null;
	});
</script>

<form use:enhance method="post" action="?/extendRent">
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1">New Contract End Date</span>
		<input
			name="contractEndDate"
			bind:value={$extendContractForm.contractEndDate}
			{...$constraints.contractEndDate}
			class=" border-[1px] border-black/60 rounded-md p-2 mt-2"
			type="date"
			bind:this={dateInput}
			onclick={() => {
				dateInput && dateInput.showPicker();
			}}
		/>
	</label>
	<button type="submit" class="bg-primary mt-4 text-white rounded-md py-2 w-full">
		Extend Rent</button
	>
</form>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	import { toast } from '@zerodevx/svelte-toast';
	export let data: PageData;
	export let form: ActionData;
	export let unitId: string | undefined;
	let dateInput: any;

	const {
		form: endContractForm,
		enhance,
		constraints
	} = superForm(data.endRentForm, {
		onSubmit: ({ formData, cancel }) => {
			if (unitId) {
				formData.set('unitRenalId', unitId);
			} else {
				toast.push('Unit not found');
				cancel();
			}
		}
	});

	$: form?.updateEndDate ? toast.push('Rent end initialized successfully') : null;
</script>

<form use:enhance method="post" action="?/initialEndContract">
	<label class="grid">
		<span class="text-primary font-medium"> Description </span>
		<textarea
			name="terminationReason"
			required
			bind:value={$endContractForm.terminationReason}
			{...$constraints.terminationReason}
			class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
		/>
	</label>
	<button type="submit" class="bg-primary mt-4 text-white rounded-md py-2 w-full"> End Rent</button>
</form>

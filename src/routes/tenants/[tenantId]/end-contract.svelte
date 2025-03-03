<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
	import type { ActionData, PageData } from './$types'
	import { toast } from '@zerodevx/svelte-toast'
	interface Props {
		data: PageData
		form: ActionData
		unitId: string | undefined
	}

	let { data, form, unitId }: Props = $props()
	let dateInput: any

	const {
		form: endContractForm,
		enhance,
		constraints,
	} = superForm(data.endRentForm, {
		onSubmit: ({ formData, cancel }) => {
			if (unitId) {
				formData.set('unitRenalId', unitId)
			} else {
				toast.push('Unit not found')
				cancel()
			}
		},
	})

	$effect.pre(() => {
		form?.updateEndDate ? toast.push('Rent end initialized successfully') : null
	})
</script>

<form use:enhance method="post" action="?/initialEndContract">
	<label class="grid">
		<span class="font-medium text-primary"> Description </span>
		<textarea
			name="terminationReason"
			required
			bind:value={$endContractForm.terminationReason}
			{...$constraints.terminationReason}
			class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
		></textarea>
	</label>
	<button type="submit" class="mt-4 w-full rounded-md bg-primary py-2 text-white"> End Rent</button>
</form>

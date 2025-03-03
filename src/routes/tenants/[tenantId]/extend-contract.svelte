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
	let dateInput: any = $state()

	const {
		form: extendContractForm,
		enhance,
		constraints,
	} = superForm(data.extendRentForm, {
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
		form?.updateEndDate ? toast.push('Rent extended successfully') : null
	})
</script>

<form use:enhance method="post" action="?/extendRent">
	<label class="grid flex-1">
		<span class="py-1 font-semibold text-primary">New Contract End Date</span>
		<input
			name="contractEndDate"
			bind:value={$extendContractForm.contractEndDate}
			{...$constraints.contractEndDate}
			class=" mt-2 rounded-md border-[1px] border-black/60 p-2"
			type="date"
			bind:this={dateInput}
			onclick={() => {
				dateInput && dateInput.showPicker()
			}}
		/>
	</label>
	<button type="submit" class="mt-4 w-full rounded-md bg-primary py-2 text-white">
		Extend Rent</button
	>
</form>

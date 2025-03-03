<script lang="ts">
	import type { PageData, ActionData } from './$types'
	import Delete from '$lib/assets/delete.svg.svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { page } from '$app/state'

	interface Props {
		row: any
		data: PageData
		form: ActionData
	}

	let { row, data, form }: Props = $props()

	const { enhance } = superForm(data.deletePropertyForm, {
		id: row.id,
		onSubmit: ({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this Unit?')) {
				cancel()
			}
			formData.set('propertyId', row.id)
		},
	})
</script>

{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_UNIT_PROPERTY')}
	<form use:enhance method="post" action="?/deleteProperty">
		<button
			onclick={(e) => {
				e.stopPropagation()
			}}
		>
			<Delete class="text-danger" />
		</button>
	</form>
{/if}

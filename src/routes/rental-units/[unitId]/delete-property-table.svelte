<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Delete from '$lib/assets/delete.svg.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from '@zerodevx/svelte-toast';
	export let row: any;

	export let data: PageData;
	export let form: ActionData;

	const { enhance } = superForm(data.deletePropertyForm, {
		id: row.id,
		onSubmit: ({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this Unit?')) {
				cancel();
			}
			formData.set('propertyId', row.id);
		}
	});

	// $: form?.deleteProperty ? toast.push('Property deleted successfully') : null;
</script>

<form use:enhance method="post" action="?/deleteProperty">
	<button on:click|stopPropagation={() => {}}> <Delete class="text-danger" /> </button>
</form>

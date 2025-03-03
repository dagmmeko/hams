<script lang="ts">
	import { run, stopPropagation } from 'svelte/legacy';

	import type { PageData, ActionData } from './$types';
	import Delete from '$lib/assets/delete.svg.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';


	interface Props {
		row: any;
		data: PageData;
		form: ActionData;
	}

	let { row, data, form }: Props = $props();

	run(() => {
		form?.deleteAmenity ? toast.push('Amenity deleted successfully') : null;
	});

	// const { enhance } = superForm(data.deletePropertyForm, {
	// 	id: row.id,
	// 	onSubmit: ({ formData, cancel }) => {
	// 		if (!window.confirm('Are you sure you want to delete this Unit?')) {
	// 			cancel();
	// 		}
	// 		formData.set('amenityId', row.id);
	// 	}
	// });

	// $: form?.deleteProperty ? toast.push('Property deleted successfully') : null;
</script>

{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'DELETE_UNIT_AMENITIES')}
	<form
		use:enhance={({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this Amenity?')) {
				cancel();
			}
			formData.set('amenityId', row.id);
		}}
		method="post"
		action="?/deleteAmenity"
	>
		<button onclick={stopPropagation(() => {})}> <Delete class="text-danger" /> </button>
	</form>
{/if}

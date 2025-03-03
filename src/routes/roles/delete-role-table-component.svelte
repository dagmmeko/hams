<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';

	import Delete from '$lib/assets/delete.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	interface Props {
		row: any;
		data: PageData;
	}

	let { row, data }: Props = $props();

	const { enhance } = superForm(data.deleteRoleForm, {
		onSubmit: ({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this role?')) {
				cancel();
			}
			formData.set('deleteRoleId', row.id);
		}
	});
</script>

<div>
	{#if row.Employees.length}
		<button
			onclick={stopPropagation(() => toast.push('Can not delete a role with Employees in it.'))}
			><Delete class="text-subtitle" />
		</button>
	{:else}
		<form use:enhance method="post" action="?/archiveRole">
			<button onclick={stopPropagation(() => {})}> <Delete class="text-danger" /> </button>
		</form>
	{/if}
</div>

<script lang="ts">
	import Delete from '$lib/assets/delete.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	export let row: any;
	export let data: PageData;

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
			on:click|stopPropagation={() => toast.push('Can not delete a role with Employees in it.')}
			><Delete class="text-subtitle" />
		</button>
	{:else}
		<form use:enhance method="post" action="?/archiveRole">
			<button on:click|stopPropagation={() => {}}> <Delete class="text-danger" /> </button>
		</form>
	{/if}
</div>

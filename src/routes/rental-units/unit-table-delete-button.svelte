<script lang="ts">
	import type { PageData } from './$types';
	import Delete from '$lib/assets/delete.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import Tenant from '$lib/assets/tenant.svg.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	export let row: any;
	export let data: PageData;

	const { enhance } = superForm(data.deleteUnitForm, {
		onSubmit: ({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this Unit?')) {
				cancel();
			}
			formData.set('deleteUnitId', row.id);
		}
	});
</script>

<div class="">
	{#if row.Tenants.length > 0 && row.Tenants[0].active}
		<button on:click|stopPropagation={() => toast.push('Can not delete a Unit with Tenant in it.')}
			><Delete class="text-subtitle" />
		</button>
	{:else}
		<form use:enhance method="post" action="?/archiveUnit">
			<button on:click|stopPropagation={() => {}}> <Delete class="text-danger" /> </button>
		</form>
	{/if}
</div>

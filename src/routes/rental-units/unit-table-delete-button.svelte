<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';

	import type { PageData } from './$types';
	import Delete from '$lib/assets/delete.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/state';


	interface Props {
		row: any;
		data: PageData;
	}

	let { row, data }: Props = $props();

	const { enhance } = superForm(data.deleteUnitForm, {
		id: row.id,
		onSubmit: ({ formData, cancel }) => {
			if (!window.confirm('Are you sure you want to delete this Unit?')) {
				cancel();
			}
			formData.set('deleteUnitId', row.id);
		}
	});

	let unitRow = $derived(data.units.find((unit) => unit.id === row.id));
</script>

{#if page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ARCHIVE_RENTAL_UNIT')}
	<div class="">
		{#if unitRow && unitRow.active}
			<button
				onclick={stopPropagation(() => toast.push('Can not delete a Unit with Tenant in it.'))}
			>
				<Delete class="text-subtitle" />
			</button>
		{:else}
			<form use:enhance method="post" action="?/archiveUnit">
				<button onclick={stopPropagation(() => {})}>
					<Delete class="text-danger" />
				</button>
			</form>
		{/if}
	</div>
{/if}

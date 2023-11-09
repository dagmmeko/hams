<script lang="ts">
	import type { PageData } from './$types';
	import Delete from '$lib/assets/delete.svg.svelte';
	export let row: any;
	export let data: PageData;
</script>

<div class="">
	<form method="post" action="?/deleteTask">
		<button on:click|stopPropagation={() => alert('Are you sure you want to delete the task?')}>
			<Delete color="#EC6738" class="h-6 w-6" />
		</button>
	</form>
</div>

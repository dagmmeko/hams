<script lang="ts">
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
	<div class="text-3xl">Rental History</div>
	<div class="grid grid-cols-2 mt-6">
		<div class="w-full bg-red-50">Active Rooms</div>
		<div />
	</div>
</div>

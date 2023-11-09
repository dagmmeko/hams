<script lang="ts">
	let alt = '';
	let image = '';
	export let row: any;
</script>

<div class="grid grid-flow-col items-center">
	<div class="bg-ghost/60 w-10 h-10 rounded-full flex items-center justify-center">
		<div class=" text-purple-500 text-lg">DM</div>
	</div>
	<div class="font-inter text-base font-medium">{row.name}</div>
</div>

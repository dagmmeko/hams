<script lang="ts">
	let alt = ''
	let image = ''
	interface Props {
		row: any
	}

	let { row }: Props = $props()
</script>

<div class="grid grid-flow-col items-center">
	<div class="flex h-10 w-10 items-center justify-center rounded-full bg-ghost/60">
		<div class=" text-lg text-purple-500">DM</div>
	</div>
	<div class="font-inter text-base font-medium">{row.name}</div>
</div>

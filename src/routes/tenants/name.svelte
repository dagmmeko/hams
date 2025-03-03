<script lang="ts">
	interface Props {
		row: any;
	}

	let { row }: Props = $props();
</script>

<div class="grid grid-flow-col w-fit gap-6 items-center">
	<!-- <img src={QR} alt="img" class="w-10 h-10 rounded-full" /> -->
	<div class="grid">
		<span class="text-sm font-medium"> {row.tenant.fullName}</span>
		<span class="text-xs"> <span class="text-primary">Score</span> {row.tenant.tenantScore}</span>
	</div>
</div>

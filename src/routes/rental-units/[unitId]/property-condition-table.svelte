<script lang="ts">
	export let row: any;
	console.log({ row });
</script>

<div
	class="text-[10px] text-center min-w-max max-w-[120px] p-1 rounded-full {row.propertyStatus ===
	'GOOD_CONDITION'
		? 'bg-success text-white'
		: row.propertyStatus === 'NEEDS_REPAIR'
		? 'bg-warning text-black/70'
		: row.propertyStatus === 'OUT_OF_SERVICE'
		? 'bg-danger text-white'
		: row.propertyStatus === 'MISSING_ITEMS'
		? 'bg-info text-white'
		: ''}"
>
	{row.propertyStatus.replace(/_/g, ' ')}
</div>

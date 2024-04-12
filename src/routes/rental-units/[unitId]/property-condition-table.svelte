<script lang="ts">
	export let row: any;
</script>

<span
	class="md:text-[8px] text-[6px] text-center p-1 w-full rounded-full {row.propertyStatus ===
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
</span>

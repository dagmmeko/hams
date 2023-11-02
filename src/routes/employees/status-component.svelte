<script lang="ts">
	import type { PageData } from './$types';
	import Dot from '$lib/assets/dot.svg.svelte';

	export let row: any;
	export let data: PageData;

	$: console.log({ row });
</script>

<div
	class="flex items-center justify-center gap-1 {row.isFired
		? 'bg-danger/20 text-danger text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit'
		: row.isSuspended
		? 'bg-danger/20 text-danger text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit'
		: row.onLeave
		? 'bg-warning/20 text-[#F0AF00] text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit'
		: row.isAbsent
		? 'bg-danger/20 text-danger text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit'
		: row.EmployeeStatus === 'FULL_TIME'
		? 'bg-success/20 text-success text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit'
		: row.EmployeeStatus === 'PART_TIME'
		? 'bg-info/20 text-info text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit'
		: 'bg-blue-300/50 text-blue-600 text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit'}}"
>
	<Dot />
	{row.isFired
		? 'Fired'
		: row.isSuspended
		? 'Suspended'
		: row.onLeave
		? 'On Leave'
		: row.isAbsent
		? 'Absent'
		: row.EmployeeStatus === 'FULL_TIME'
		? 'Full Time'
		: row.EmployeeStatus === 'PART_TIME'
		? 'Part Time'
		: 'Temporary'}
</div>

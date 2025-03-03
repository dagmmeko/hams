<script lang="ts">
	import type { PageData } from './$types'
	import Dot from '$lib/assets/dot.svg.svelte'

	interface Props {
		row: any
		data: PageData
	}

	let { row, data }: Props = $props()
</script>

<div
	class="flex items-center justify-center gap-1 {row.isFired
		? 'h-fit w-24 rounded-full bg-danger/20 px-2 py-1 text-xs font-semibold text-danger'
		: row.isSuspended
			? 'h-fit w-24 rounded-full bg-danger/20 px-2 py-1 text-xs font-semibold text-danger'
			: row.onLeave
				? 'h-fit w-24 rounded-full bg-warning/20 px-2 py-1 text-xs font-semibold text-[#F0AF00]'
				: row.isAbsent
					? 'h-fit w-24 rounded-full bg-danger/20 px-2 py-1 text-xs font-semibold text-danger'
					: row.EmploymentType === 'FULL_TIME'
						? 'h-fit w-24 rounded-full bg-success/20  px-2 py-1 text-xs font-semibold text-success'
						: row.EmploymentType === 'PART_TIME'
							? 'h-fit w-24 rounded-full bg-info/20 px-2 py-1 text-xs font-semibold text-info'
							: 'h-fit w-24 rounded-full bg-blue-300/50 px-2 py-1 text-xs font-semibold text-blue-600'}"
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
					: row.EmploymentType === 'FULL_TIME'
						? 'Full Time'
						: row.EmploymentType === 'PART_TIME'
							? 'Part Time'
							: 'Temporary'}
</div>

<script>
	export let data;
</script>

<div class="mx-10 my-12">
	<div class="mb-6">
		<p class="text-2xl font-medium text-primary">General Statistics</p>
	</div>
	<div class=" grid grid-cols-4 gap-4">
		<div class="bg-white border-[1px] border-subtitle p-3 grid rounded-sm text-center">
			<span>Occupancy rates</span>
			<span>{data.activeUnit} / {data.allUnits}</span>
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Bookings by source
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			Upcoming reservations
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">unit status</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			employee on leave
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			employees absent
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			employee status
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			vendor active tasks
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">
			vendor completed tasks
		</div>
		<div class="bg-white border-[1px] border-subtitle p-3 rounded-sm text-center">vendor types</div>
	</div>
</div>

<script lang="ts">
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<div class="grid grid-flow-col justify-items-stretch">
	<div class="grid">
		<p class="text-2xl">Tenant Info</p>
		<p class=" text-sm py-1 rounded-xl">Tenant details here.</p>
	</div>
	<div class="justify-self-end">
		<button type="submit" class="bg-primary text-white rounded-md py-2 px-6"> Update Info </button>
	</div>
</div>
<hr class="my-6" />
<div class="grid gap-6 grid-cols-4">
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> Full Name</span>
		<input name="roomNumber" class="border-2" />
	</label>
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> Phone Number</span>
		<input name="roomNumber" class="border-2" />
	</label>
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> Email </span>
		<input name="roomNumber" class="border-2" />
	</label>
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> Emergency Contact Name</span>
		<input name="roomNumber" class="border-2" />
	</label>
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> Emergency Contact Phone Number</span>
		<input name="roomNumber" class="border-2" />
	</label>
	<label class="grid flex-1">
		<span class="text-primary font-semibold py-1"> Emergency Contact Email</span>
		<input name="roomNumber" class="border-2" />
	</label>
</div>

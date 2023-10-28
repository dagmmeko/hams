<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import QR from '$lib/assets/qr.png';

	export let data: PageData;
</script>

<div class="">
	<div class="flex justify-between">
		<div class="grid">
			<p class="text-2xl">Rental Unit Info</p>
			<p class=" text-sm py-1 rounded-xl">Room details here.</p>
		</div>
		<button class="bg-primary text-white rounded-md py-2 px-6"> Update Info</button>
	</div>
	<hr class="my-6" />
	<div class="grid gap-6 grid-cols-4">
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Room No.</span>
			<input name="userName" placeholder="101" class="" />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Floor</span>
			<input name="phoneNumber" placeholder="1" />
		</label>

		<div class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Status</span>
			<div>Available</div>
		</div>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Condition</span>
			<input name="email" placeholder="Good Condition" />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Size</span>
			<input placeholder="140m2" />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Price</span>
			<input type="date" name="hiredDate" placeholder="15000/month" />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> Unit Type</span>
			<input placeholder="Residential" />
		</label>
		<label class="grid flex-1">
			<span class="text-primary font-semibold py-1"> No. of People Allowed</span>
			<input placeholder="6" />
		</label>
	</div>

	<p class="text-2xl mt-10">Documents</p>
	<hr class="my-6" />
	<div>
		<img src={QR} alt="qr" />
	</div>

	<p class="text-2xl mt-10">Danger</p>
	<hr class="my-6" />

	<div class="border-2 border-danger border-dashed rounded-md p-5">
		<div class="flex justify-between">
			<div>
				<p class="text-lg">Archive Rental Unit</p>
				<p class="text-black/50">
					Remove all data related to rental unit. Once you take this action there is no going back.
				</p>
			</div>
			<button class="bg-danger text-white rounded-md py-2 px-6">Archive</button>
		</div>
	</div>
</div>

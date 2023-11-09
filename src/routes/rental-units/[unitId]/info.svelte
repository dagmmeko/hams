<script lang="ts">
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import QR from '$lib/assets/qr.png';

	export let data: PageData;
	const {
		form: editUnitForm,
		enhance: editUnitFormEnhance,
		constraints
	} = superForm(data.editUnitForm);
</script>

<div>
	<form use:editUnitFormEnhance method="post" action="?/editUnitInfo">
		<div class="flex justify-between">
			<div class="grid">
				<p class="text-2xl">Rental Unit Info</p>
				<p class=" text-sm py-1 rounded-xl">Room details here.</p>
			</div>
			<button type="submit" class="bg-primary text-white rounded-md py-2 px-6"> Update Info</button>
		</div>
		<hr class="my-6" />
		<div class="grid gap-6 grid-cols-4">
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Room No.</span>
				<input
					name="roomNumber"
					bind:value={$editUnitForm.roomNumber}
					{...$constraints.roomNumber}
					class=""
				/>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Floor</span>
				<input name="floor" bind:value={$editUnitForm.floor} {...$constraints.floor} class="" />
			</label>

			<div class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Status</span>
				<div>Available</div>
			</div>

			<label class="grid">
				<span class="text-primary font-semibold py-1"> Condition </span>
				<select
					required
					name="condition"
					bind:value={$editUnitForm.condition}
					{...$constraints.condition}
				>
					<option selected disabled> Pick a role </option>
					<option value="OUT_OF_SERVICE"> Out of service </option>
					<option value="NEEDS_REPAIR"> Needs Repair </option>
					<option value="GOOD_CONDITION"> Good Condition </option>
				</select>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Size</span>
				<input name="size" bind:value={$editUnitForm.size} {...$constraints.size} />
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> Price</span>
				<input name="price" bind:value={$editUnitForm.price} {...$constraints.price} />
			</label>

			<label class="grid">
				<span class="text-primary font-semibold py-1"> Unit Type </span>
				<select
					required
					name="unitType"
					bind:value={$editUnitForm.unitType}
					{...$constraints.unitType}
				>
					<option selected disabled> Pick a Type </option>
					<option value="RESIDENTIAL"> Residential </option>
					<option value="COMMERCIAL"> Commercial </option>
				</select>
			</label>
			<label class="grid flex-1">
				<span class="text-primary font-semibold py-1"> No. of People Allowed</span>
				<input
					name="maximumTenants"
					bind:value={$editUnitForm.maximumTenants}
					{...$constraints.maximumTenants}
				/>
			</label>
		</div>

		<p class="text-2xl mt-10">Documents</p>
		<hr class="my-6" />
		<div>
			<img src={QR} alt="qr" />
		</div>
	</form>

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

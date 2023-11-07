<script lang="ts">
	import QR from '$lib/assets/qr.png';
</script>

<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Rental Units / New Rental Unit</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<div class="">
			<p class="text-2xl font-medium">New Rental Unit</p>
			<p class="text-sm py-2">Register new rental unit here. Click save when you're done.</p>
		</div>
		<form class="grid grid-flow-col mt-6">
			<div class="grid">
				<label class="grid">
					<span class="text-primary font-medium"> Room Number </span>
					<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Floor </span>
					<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Size </span>
					<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Price </span>
					<input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Unit Type </span>
					<select class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2">
						<option selected disabled> Pick a Type </option>
						<option> Residential </option>
						<option> Commercial </option>
					</select>
				</label>

				<div>
					Room Documents
					<img src={QR} alt="qr" />
				</div>
				<button class="bg-primary text-white rounded-md py-2 px-6 w-fit"> Create unit</button>
			</div>
			<div class="grid">
				<label class="">
					<span class="text-primary font-medium"> Condition </span>
					<select class="mt-2 w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2">
						<option selected disabled> Pick a role </option>
						<option> Good Condition </option>
						<option> Need Repair </option>
						<option> Out of service </option>
					</select>
				</label>
				<label class="">
					<span class="text-primary font-medium"> Minimum Rental Day </span>
					<input class="w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2" />
				</label>
				<label class="">
					<span class="text-primary font-medium"> Number of People Allowed </span>
					<input class="w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2" />
				</label>
			</div>
		</form>
	</div>
</div>

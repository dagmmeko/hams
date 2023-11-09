<div class="mt-6 mx-10">
	<p class="text-xs text-black/50">Tenants / New Tenants</p>
	<div class=" bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">
		<div class="">
			<p class="text-2xl font-medium">New Tenant</p>
			<p class="text-sm py-2">Register new Tenant here. Click save when you're done.</p>
		</div>
		<!-- <form method="post" action="?/addUnit" use:addFormEnhance class="grid grid-flow-col mt-6">
			<div class="flex flex-col gap-4">
				<label class="grid">
					<span class="text-primary font-medium"> Room Number </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="roomNumber"
						bind:value={$addUnitForm.roomNumber}
						{...$constraints.roomNumber}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Floor </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="floor"
						bind:value={$addUnitForm.floor}
						{...$constraints.floor}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Size </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="size"
						bind:value={$addUnitForm.size}
						{...$constraints.size}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Price </span>
					<input
						class="w-[420px] border-[1px] border-black/60 rounded-md p-2"
						required
						name="price"
						bind:value={$addUnitForm.price}
						{...$constraints.price}
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Unit Type </span>
					<select
						required
						name="unitType"
						bind:value={$addUnitForm.unitType}
						{...$constraints.unitType}
						class="mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Pick a Type </option>
						<option value="RESIDENTIAL"> Residential </option>
						<option value="COMMERCIAL"> Commercial </option>
					</select>
				</label>

				<div>
					Room Documents
					<img src={QR} alt="qr" />
				</div>
				<button class="bg-primary text-white rounded-md py-2 px-6 w-fit"> Create unit</button>
			</div>
			<div class="flex flex-col gap-4">
				<label class="grid">
					<span class="text-primary font-medium"> Condition </span>
					<select
						required
						name="condition"
						bind:value={$addUnitForm.condition}
						{...$constraints.condition}
						class="mt-2 w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
					>
						<option selected disabled> Pick a role </option>
						<option value="OUT_OF_SERVICE"> Out of service </option>
						<option value="NEEDS_REPAIR"> Needs Repair </option>
						<option value="GOOD_CONDITION"> Good Condition </option>
					</select>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Minimum Rental Day </span>
					<input
						required
						name="minimumRentalDate"
						bind:value={$addUnitForm.minimumRentalDate}
						{...$constraints.minimumRentalDate}
						class="w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
				<label class="grid">
					<span class="text-primary font-medium"> Number of People Allowed </span>
					<input
						required
						name="maximumTenants"
						bind:value={$addUnitForm.maximumTenants}
						{...$constraints.maximumTenants}
						class="w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
					/>
				</label>
			</div>
		</form> -->
	</div>
</div>

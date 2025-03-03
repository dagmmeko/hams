<script lang="ts">
	import { clickOutside } from '$lib/utils/click-outside'
	import { superForm } from 'sveltekit-superforms/client'
	import { page } from '$app/stores'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import Delete from '$lib/assets/delete.svg.svelte'
	import Eye from '$lib/assets/eye.svg.svelte'
	import FileBg from '$lib/assets/file-bg.png'
	import FileUp from '$lib/assets/file-up.svg.svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import type { ActionData, PageData } from './$types'
	import { numberToCurrency } from '$lib/utils/currency'
	import { uploadFiles } from '$lib/utils/upload-files'

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data = $bindable(), form = $bindable() }: Props = $props()
	let dateInput: any = $state()
	let fileNames: string[] = $state([])

	$effect.pre(() => {
		form?.fileUrl ? window.open(form?.fileUrl, '_blank') : null
	})
	const {
		form: editUnitForm,
		enhance: editUnitFormEnhance,
		constraints,
	} = superForm(data.editUnitForm, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.push('Unit updated successfully')
			}
		},
	})

	$effect.pre(() => {
		form?.errorMessage ? toast.push(form.errorMessage) : null
	})

	let modal = $state(false)
</script>

<div>
	<form use:editUnitFormEnhance method="post" action="?/editUnitInfo">
		<div class="grid-flow-col justify-items-stretch md:grid">
			<div class="grid">
				<p class="text-2xl">Rental Unit Info</p>
				<p class=" rounded-xl py-1 text-sm">Room details here.</p>
			</div>
			<div class="justify-self-end">
				{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ADD_NEW_INSPECTION')}
					<button
						onclick={(e) => {
							e.preventDefault()
							modal = true
						}}
						class="mb-3 mr-4 rounded-md bg-warning px-6 py-2 text-black/70 md:mb-0"
					>
						New Inspection
					</button>
				{/if}
				{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'EDIT_RENTAL_UNIT')}
					<button type="submit" class="rounded-md bg-primary px-6 py-2 text-white">
						Update Info
					</button>
				{/if}
			</div>
		</div>
		<hr class="my-6" />
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<label class="grid h-fit flex-1">
				<span class="py-1 font-semibold text-primary"> Room No.</span>
				<input
					name="roomNumber"
					bind:value={$editUnitForm.roomNumber}
					{...$constraints.roomNumber}
					class=""
				/>
			</label>
			<label class="grid h-fit flex-1">
				<span class="py-1 font-semibold text-primary"> Floor</span>
				<input name="floor" bind:value={$editUnitForm.floor} {...$constraints.floor} class="" />
			</label>

			<div class="grid flex-1">
				<span class="py-1 font-semibold text-primary"> Status</span>
				<div>{data.unitDetails?.active ? 'Occupied' : 'Vacant'}</div>
			</div>

			<label class="grid h-fit">
				<span class="py-1 font-semibold text-primary"> Condition </span>
				<select
					disabled
					name="condition"
					bind:value={$editUnitForm.condition}
					{...$constraints.condition}
				>
					<option selected disabled> Unit Condition </option>

					<option value="GOOD_CONDITION"> Good Condition </option>
					<option value="NEEDS_REPAIR"> Needs Repair </option>
					<option value="OUT_OF_SERVICE"> Out of service </option>
				</select>
			</label>
			<label class="grid h-fit flex-1">
				<span class="py-1 font-semibold text-primary"> Size</span>
				<input name="size" bind:value={$editUnitForm.size} {...$constraints.size} />
			</label>
			{#if data.unitDetails?.priceSetPerKare}
				<label class="grid h-fit flex-1">
					<span class="py-1 font-semibold text-primary"> Price</span>
					<div>
						<input
							value={numberToCurrency(data.unitDetails?.price * data.unitDetails?.kareMeter, {
								currency: data.unitDetails?.currency,
								currencyDisplay: 'code',
							})}
							disabled
						/>
					</div>
					<div class="mt-1 text-xs">
						<!-- <span> {data.unitDetails?.currency === 'ETB' ? 'USD' : 'ETB'} </span> -->
						{#if data.unitDetails?.priceSetPerKare}
							<span>
								{data.unitDetails?.currency === 'ETB'
									? numberToCurrency(
											(data.unitDetails?.price * data.unitDetails?.kareMeter) /
												data.usdRate[0].rate,
											{
												currency: 'USD',
												currencyDisplay: 'code',
											},
										)
									: numberToCurrency(
											data.unitDetails?.price * data.unitDetails?.kareMeter * data.usdRate[0].rate,
											{
												currency: 'ETB',
												currencyDisplay: 'code',
											},
										)}
							</span>
						{:else}
							<span>
								{data.unitDetails?.currency === 'ETB'
									? numberToCurrency($editUnitForm.price / data.usdRate[0].rate, {
											currency: 'USD',
											currencyDisplay: 'code',
										})
									: numberToCurrency($editUnitForm.price * data.usdRate[0].rate, {
											currency: 'ETB',
											currencyDisplay: 'code',
										})}
							</span>
						{/if}
					</div>
				</label>
			{:else}
				<label class="grid h-fit flex-1">
					<span class="py-1 font-semibold text-primary"> Price</span>
					<div>
						<span class="text-sm text-gray-600"> {data.unitDetails?.currency} </span>
						<input
							type="number"
							step="0.01"
							name="price"
							bind:value={$editUnitForm.price}
							{...$constraints.price}
						/>
					</div>
					<div class="mt-1 text-xs">
						<!-- <span> {data.unitDetails?.currency === 'ETB' ? 'USD' : 'ETB'} </span> -->
						<span>
							{data.unitDetails?.currency === 'ETB'
								? numberToCurrency($editUnitForm.price / data.usdRate[0].rate, {
										currency: 'USD',
										currencyDisplay: 'code',
									})
								: numberToCurrency($editUnitForm.price * data.usdRate[0].rate, {
										currency: 'ETB',
										currencyDisplay: 'code',
									})}
						</span>
					</div>
				</label>
			{/if}

			<label class="grid h-fit flex-1">
				<span class="py-1 font-semibold text-primary">Utility Price</span>
				<div>
					<span class="text-sm text-gray-600"> {data.unitDetails?.currency} </span>
					<input
						name="utilityPrice"
						bind:value={$editUnitForm.utilityPrice}
						{...$constraints.utilityPrice}
					/>
				</div>
				<div class="mt-1 text-xs">
					<!-- {data.unitDetails?.currency} -->
					<span>
						{data.unitDetails?.currency === 'ETB'
							? numberToCurrency(($editUnitForm.utilityPrice || 0) / data.usdRate[0].rate, {
									currency: 'USD',
									currencyDisplay: 'code',
								})
							: numberToCurrency(($editUnitForm.utilityPrice || 0) * data.usdRate[0].rate, {
									currency: 'ETB',
									currencyDisplay: 'code',
								})}
					</span>
				</div>
			</label>

			<div class="gird h-fit">
				<span class="py-1 font-semibold text-primary"> Price Total </span>
				<div class="grid">
					<!-- <span class="text-sm text-gray-600"> {data.unitDetails?.currency} </span> -->
					{#if data.unitDetails?.priceSetPerKare}
						<span>
							<!-- {data.unitDetails.price * data.unitDetails.kareMeter + } -->
							<div>
								{numberToCurrency(
									data.unitDetails.price * data.unitDetails.kareMeter +
										data.unitDetails.utilityPrice,
									{
										currency: data.unitDetails?.currency,
										currencyDisplay: 'code',
									},
								)}
							</div>
							<div class="mt-1 text-xs">
								{#if data.unitDetails?.currency === 'ETB'}
									{numberToCurrency(
										((data.unitDetails.price || 0) * data.unitDetails.kareMeter +
											(data.unitDetails.utilityPrice || 0)) /
											data.usdRate[0].rate,
										{
											currency: 'USD',
											currencyDisplay: 'code',
										},
									)}{:else}
									{numberToCurrency(
										((data.unitDetails.price || 0) * data.unitDetails.kareMeter +
											(data.unitDetails.utilityPrice || 0)) *
											data.usdRate[0].rate,
										{
											currency: 'ETB',
											currencyDisplay: 'code',
										},
									)}{/if}
							</div>
						</span>
					{:else}
						<span>
							<div>
								{numberToCurrency(($editUnitForm.price || 0) + ($editUnitForm.utilityPrice || 0), {
									currency: data.unitDetails?.currency,
									currencyDisplay: 'code',
								})}
							</div>
							<div class="mt-1 text-xs">
								{#if data.unitDetails?.currency === 'ETB'}
									{numberToCurrency(
										(($editUnitForm.price || 0) + ($editUnitForm.utilityPrice || 0)) /
											data.usdRate[0].rate,
										{
											currency: 'USD',
											currencyDisplay: 'code',
										},
									)}
								{:else}
									{numberToCurrency(
										(($editUnitForm.price || 0) + ($editUnitForm.utilityPrice || 0)) *
											data.usdRate[0].rate,
										{
											currency: 'ETB',
											currencyDisplay: 'code',
										},
									)}
								{/if}
							</div>
						</span>
					{/if}
				</div>
			</div>
			<label class="grid h-fit">
				<span class="py-1 font-semibold text-primary"> Unit Type </span>
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
			<label class="grid h-fit flex-1">
				<span class="py-1 font-semibold text-primary"> No. of People Allowed</span>
				<input
					name="maximumTenants"
					bind:value={$editUnitForm.maximumTenants}
					{...$constraints.maximumTenants}
				/>
			</label>
			<div class="grid">
				<label class="flex h-fit items-center gap-3">
					<input
						type="checkbox"
						name="priceSetPerKare"
						bind:checked={$editUnitForm.priceSetPerKare}
						{...$constraints.priceSetPerKare}
						class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
					/>
					<span class="font-medium text-primary"> Per is set in m2 </span>
				</label>

				<label class="flex h-fit items-center gap-3">
					<input
						type="checkbox"
						name="inBirr"
						bind:checked={$editUnitForm.inBirr}
						{...$constraints.inBirr}
						class=" h-5 w-5 rounded-md border-[1px] border-black/60 p-2"
					/>
					<span class="font-medium text-primary"> In Ethiopian Birr </span>
				</label>
			</div>
			<label class="grid h-fit flex-1">
				<span class="py-1 font-semibold text-primary"> Price per m2</span>
				{#if data.unitDetails?.priceSetPerKare}
					<div>
						<span class="text-sm text-gray-600"> {data.unitDetails?.currency} </span>
						<input
							type="number"
							step="0.01"
							name="price"
							bind:value={$editUnitForm.price}
							{...$constraints.price}
						/>
					</div>
					<div class="mt-1 text-xs">
						<span>
							{data.unitDetails?.currency === 'ETB'
								? numberToCurrency($editUnitForm.price / data.usdRate[0].rate, {
										currency: 'USD',
										currencyDisplay: 'code',
									})
								: numberToCurrency($editUnitForm.price * data.usdRate[0].rate, {
										currency: 'ETB',
										currencyDisplay: 'code',
									})}
						</span>
					</div>
				{:else}
					<div>
						<span class="text-sm text-gray-600"> {data.unitDetails?.currency} </span>
						<input
							value={((data.unitDetails?.price || 0) / (data.unitDetails?.kareMeter || 1)).toFixed(
								2,
							) || 0}
							disabled
						/>
					</div>
				{/if}
			</label>
		</div>
	</form>

	<!-- File display section moved outside main form -->
	<div class=" my-8 flex w-full flex-1 flex-shrink-0 flex-wrap items-start gap-2">
		{#each data.unitDetails?.UnitsFile ?? [] as file}
			<div class="w-[180px] rounded-lg border-[1px] border-dashed border-primary">
				<div class="relative">
					<div class=" relative z-10 h-36 w-full">
						<img src={FileBg} alt="bg" class="h-full w-full" />
					</div>

					<div class="absolute left-0 top-0 z-30 h-full w-full">
						<form
							id="downloadUnitFile"
							method="post"
							action="?/downloadUnitFile"
							use:enhance={({ formData }) => {
								formData.set('unitKey', `${file.File.key}`)
								return async ({ result, update }) => {
									await update()

									if (result.type === 'success') {
									}
								}
							}}
							class="flex h-full flex-col items-center justify-center gap-2"
						>
							<button
								onclick={(e) => {
									e.stopPropagation()
								}}
								type="submit"
							>
								<div class="flex h-full w-full flex-col items-center justify-center">
									<Eye class="h-7 w-7 text-primary" />
									<span class="mx-3 break-all py-2 text-sm">
										{file.File.fileName}
									</span>
								</div>
							</button>
						</form>
					</div>
				</div>
				<form
					id="deleteUnitFile"
					method="post"
					action="?/deleteUnitFile"
					use:enhance={({ formData }) => {
						formData.set('unitFileId', `${file.fileId}`)
						return async ({ result }) => {
							if (result.type === 'success') {
								toast.push('File deleted successfully')
							}
						}
					}}
				>
					<button
						onclick={(e) => {
							e.stopPropagation()
						}}
						class="flex w-full items-center justify-center gap-1 p-2"
					>
						<Delete class="h-5 w-5 text-danger" />
						<span class="text-sm text-danger">Delete</span>
					</button>
				</form>
			</div>
		{/each}

		<div
			class="relative max-h-96 max-w-[180px] flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
		>
			<form
				id="editUnitFile"
				method="post"
				action="?/editUnitFile"
				use:enhance={({ formData }) => {
					formData.set('fileNames', fileNames.join(','))
					formData.set('unitFile', 'Files')
				}}
				enctype="multipart/form-data"
			>
				<label>
					<input
						class="hidden"
						type="file"
						name="unitFile"
						multiple
						onchange={async (e) => {
							const uploadPromises = []
							const cal = e.currentTarget.form
							for (const file of e.currentTarget.files ?? []) {
								uploadPromises.push(
									(async function () {
										if (data.unitDetails) {
											fileNames = [...fileNames, file.name]
											return await uploadFiles(file, `unitFile/${data.unitDetails.id}/${file.name}`)
										}
									})(),
								)
							}
							const successes = await Promise.all(uploadPromises)

							if (!successes.find((s) => s !== true)) {
								// @ts-ignore
								cal.requestSubmit()
							}
						}}
					/>

					<div class=" relative z-10 h-44"></div>
					<div class="absolute left-0 top-0 z-30 h-full w-full">
						<div class="flex h-full flex-col items-center justify-center gap-2">
							<FileUp class="h-7 w-7 text-primary" />
							<span class="text-xs">Upload File</span>
							<p class="px-3 text-center text-[10px]">
								Contract, Agreement, pictures or any other document
							</p>
						</div>
					</div>
				</label>
			</form>
		</div>
	</div>

	{#if $page.data.session?.authUser.Employee.Role.Scopes.find((s) => s.name === 'ARCHIVE_RENTAL_UNIT')}
		<p class="mt-6 text-2xl">Danger</p>
		<hr class="my-6" />

		<div class="rounded-md border-2 border-dashed border-danger p-5">
			<div class="justify-between md:flex">
				<div>
					<p class="text-lg">Archive Rental Unit</p>
					<p class="text-black/50">
						Remove all data related to rental unit. Once you take this action there is no going
						back.
					</p>
				</div>
				<form
					method="post"
					action="?/archiveUnit"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								toast.push('Unit archived successfully')
								goto('/rental-units')
							}
						}
					}}
				>
					{#if data.unitDetails?.active}
						<button
							onclick={(e) => {
								e.preventDefault()
								toast.push('Can not delete a Unit with Tenant in it.')
							}}
							class="rounded-md bg-subtitle px-6 py-2 text-white"
						>
							Archive
						</button>
					{:else}
						<button class="rounded-md bg-danger px-6 py-2 text-white">Archive</button>
					{/if}
				</form>
			</div>
		</div>
	{/if}
</div>

{#if modal}
	<form
		method="post"
		action="?/addInspection"
		use:enhance={() => {
			return async ({ update, result }) => {
				await update()
				modal = false
				if (result.type === 'success') {
					toast.push('Inspection added successfully')
				}
			}
		}}
	>
		<div
			class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black/70"
		>
			<div
				use:clickOutside={() => (modal = false)}
				class="grid w-[480px] justify-items-stretch gap-4 rounded-xl bg-white p-8"
			>
				<div class="mb-1 text-center text-2xl font-semibold text-primary">New Inspection</div>
				<hr />
				<label class="grid h-fit flex-1">
					<span class="py-1 font-semibold text-primary"> Inspection Date </span>
					<input
						required
						name="inspectionDate"
						type="date"
						bind:this={dateInput}
						onclick={() => {
							dateInput && dateInput.showPicker()
						}}
						class=" rounded-md border-[1px] border-primary/50 p-2"
					/>
				</label>

				<label class="grid h-fit">
					<span class="py-1 font-semibold text-primary"> Condition </span>
					<select
						required
						name="inspectionCondition"
						bind:value={$editUnitForm.condition}
						{...$constraints.condition}
						class=" rounded-md border-[1px] border-primary/50 p-2"
					>
						<option selected disabled> Unit Condition </option>

						<option value="GOOD_CONDITION"> Good Condition </option>
						<option value="NEEDS_REPAIR"> Needs Repair </option>
						<option value="OUT_OF_SERVICE"> Out of service </option>
					</select>
				</label>
				<label class="grid h-fit flex-1">
					<span class="py-2 font-semibold text-primary"> Inspection Description </span>
					<textarea
						name="inspectionDescription"
						class=" h-24 rounded-md border-[1px] border-primary/50 p-2"
					></textarea>
				</label>
				<button type="submit" class="rounded-md bg-primary py-2 text-white">
					Save Inspection</button
				>
			</div>
		</div>
	</form>
{/if}

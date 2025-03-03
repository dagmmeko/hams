<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import FileUp from '$lib/assets/file-up.svg.svelte'
	import FileUpload from '$lib/assets/file-upload.svg.svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import { signOut } from '@auth/sveltekit/client'
	import { superForm } from 'sveltekit-superforms/client'

	let { data, form } = $props()

	let editable = $state(false)
	let frontFileData: string | undefined = $state()

	$effect.pre(() => {
		form?.errorMessage ? toast.push(form.errorMessage) : null
	})
	$effect.pre(() => {
		form?.passwordChanged ? toast.push('Password changed') : null
	})
	const { form: editUserForm, enhance: editUserEnhance, constraints } = superForm(data.editUserForm)
</script>

<div class="mx-10 my-12 grid justify-items-stretch rounded-xl bg-white p-8">
	<div class="mb-8 justify-self-center text-3xl font-medium text-primary">Account Setting</div>
	{#if data.fileUrl}
		<form
			method="post"
			action="?/profilePicture"
			class="justify-self-center"
			enctype="multipart/form-data"
		>
			<label>
				<input
					class="hidden"
					type="file"
					name="profilePicture"
					accept="image/*"
					onchange={(e) => {
						const data = e.currentTarget.files
						if (data) {
							frontFileData = data[0].name
						}
						e.currentTarget.form?.submit()
					}}
				/>
				<img src={data.fileUrl} alt="profile" class="max-w-[120px] rounded-xl" />
			</label>
		</form>
	{:else}
		<form
			method="post"
			action="?/profilePicture"
			class="justify-self-center"
			enctype="multipart/form-data"
		>
			<label>
				<input
					class="hidden"
					type="file"
					name="profilePicture"
					accept="image/*"
					onchange={(e) => {
						const data = e.currentTarget.files
						if (data) {
							frontFileData = data[0].name
						}
						e.currentTarget.form?.submit()
					}}
				/>
				<div class=" ">
					{#if frontFileData}
						<div
							class="relative max-w-[180px] items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
						>
							<div class=" relative z-10 h-36 w-32"></div>

							<div class="absolute left-0 top-0 z-30 h-full w-full">
								<div class="flex h-full flex-col items-center justify-center gap-2">
									<FileUpload class="ml-2 h-6 w-6 flex-shrink-0 text-black" />
									<p class="ml-2 py-2 text-sm">{frontFileData}</p>
								</div>
							</div>
						</div>
					{:else}
						<div
							class="relative max-h-96 max-w-[180px] flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-lg border-[1px] border-dashed border-primary"
						>
							<div class=" relative z-10 h-36 w-44"></div>
							<div class="absolute left-0 top-0 z-30 h-full w-full">
								<div class="flex h-full flex-col items-center justify-center gap-2">
									<FileUp class="h-7 w-7 text-primary" />
									<span class="text-xs">Upload Profile Picture</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</label>
		</form>
	{/if}
	<button
		onclick={() => signOut()}
		class="mt-4 w-fit justify-self-center rounded-lg border-dashed bg-danger/90 px-10 py-2 text-xs text-white"
	>
		Sign Out</button
	>

	<form
		use:editUserEnhance
		method="post"
		action="?/editUser"
		class="mt-12 grid justify-items-stretch"
	>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<label class="grid gap-2">
				<span class="font-medium text-primary"> Username </span>
				<input
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="userName"
					bind:value={$editUserForm.userName}
					{...$constraints.userName}
					onchange={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="font-medium text-primary"> Phone Number </span>
				<input
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="phoneNumber"
					bind:value={$editUserForm.phoneNumber}
					{...$constraints.phoneNumber}
					onchange={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="font-medium text-primary"> Email </span>
				<input
					disabled
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="email"
					value={page.data.session?.authUser.email}
				/>
			</label>

			<label class="grid gap-2">
				<span class="font-medium text-primary"> Address </span>
				<input
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="address"
					bind:value={$editUserForm.address}
					{...$constraints.address}
					onchange={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="font-medium text-primary"> Date of Birth </span>
				<input
					type="date"
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="dateOfBirth"
					bind:value={$editUserForm.dateOfBirth}
					{...$constraints.dateOfBirth}
					onchange={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="font-medium text-primary"> Blood Type </span>
				<input
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="bloodType"
					bind:value={$editUserForm.bloodType}
					{...$constraints.bloodType}
					onchange={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="font-medium text-primary"> Height </span>
				<input
					type="number"
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="height"
					bind:value={$editUserForm.height}
					{...$constraints.height}
					onchange={() => (editable = true)}
				/>
			</label>
		</div>
		<button
			class="mt-6 justify-self-center rounded-md bg-primary px-24 py-2 text-white"
			type="submit">Edit</button
		>
	</form>
	<form
		method="post"
		action="?/editPassword"
		class="mt-12 grid justify-items-stretch rounded-2xl border-[1px] border-dashed border-danger p-4"
		use:enhance={({ formData, cancel }) => {
			const newPassword = formData.get('newPassword')
			const confirmNewPassword = formData.get('confirmPassword')
			if (newPassword !== confirmNewPassword) {
				cancel()
				toast.push('New password and confirm password must be the same')
			}
		}}
	>
		<p class="mb-4 justify-self-center text-2xl font-medium text-primary">Change Password</p>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<label class="grid gap-2">
				<input
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="oldPassword"
					placeholder="Previous Password"
					onchange={() => (editable = true)}
					minlength="8"
					type="password"
				/>
			</label>
			<label class="grid gap-2">
				<input
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="newPassword"
					placeholder="New Password"
					onchange={() => (editable = true)}
					minlength="8"
					type="password"
				/>
			</label>
			<label class="grid gap-2">
				<input
					class=" rounded-md border-[1px] border-primary/60 p-2"
					name="confirmPassword"
					placeholder="Confirm Password"
					onchange={() => (editable = true)}
					minlength="8"
					type="password"
				/>
			</label>
		</div>
		<button
			class="mt-6 justify-self-center rounded-md bg-primary px-10 py-2 text-white"
			type="submit">Change Password</button
		>
	</form>
</div>

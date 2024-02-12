<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import FileUp from '$lib/assets/file-up.svg.svelte';
	import FileUpload from '$lib/assets/file-upload.svg.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { signOut } from '@auth/sveltekit/client';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	export let form;

	let editable = false;
	let frontFileData: string;

	$: form?.errorMessage ? toast.push(form.errorMessage) : null;
	$: form?.passwordChanged ? toast.push('Password changed') : null;
	const {
		form: editUserForm,
		enhance: editUserEnhance,
		constraints
	} = superForm(data.editUserForm);
</script>

<div class="mx-10 my-12 grid justify-items-stretch bg-white rounded-xl p-8">
	<div class="justify-self-center text-3xl text-primary font-medium mb-8">Account Setting</div>
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
					on:change={(e) => {
						const data = e.currentTarget.files;
						if (data) {
							console.log({ data });
							frontFileData = data[0].name;
						}
						e.currentTarget.form?.submit();
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
					on:change={(e) => {
						const data = e.currentTarget.files;
						if (data) {
							console.log({ data });
							frontFileData = data[0].name;
						}
						e.currentTarget.form?.submit();
					}}
				/>
				<div class=" ">
					{#if frontFileData}
						<div
							class="relative border-[1px] max-w-[180px] border-primary border-dashed rounded-lg gap-2 items-center justify-center"
						>
							<div class=" relative z-10 w-32 h-36" />

							<div class="absolute top-0 w-full h-full left-0 z-30">
								<div class="flex flex-col gap-2 justify-center items-center h-full">
									<FileUpload class="h-6 w-6 flex-shrink-0 ml-2 text-black" />
									<p class="text-sm ml-2 py-2">{frontFileData}</p>
								</div>
							</div>
						</div>
					{:else}
						<div
							class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"
						>
							<div class=" relative z-10 w-44 h-36" />
							<div class="absolute top-0 w-full h-full left-0 z-30">
								<div class="flex flex-col gap-2 justify-center items-center h-full">
									<FileUp class="text-primary w-7 h-7" />
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
		on:click={() => signOut()}
		class="text-white bg-danger/90 rounded-lg px-10 py-2 text-xs border-dashed justify-self-center mt-4 w-fit"
	>
		Sign Out</button
	>

	<form
		use:editUserEnhance
		method="post"
		action="?/editUser"
		class="mt-12 grid justify-items-stretch"
	>
		<div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
			<label class="grid gap-2">
				<span class="text-primary font-medium"> Username </span>
				<input
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="userName"
					bind:value={$editUserForm.userName}
					{...$constraints.userName}
					on:change={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-primary font-medium"> Phone Number </span>
				<input
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="phoneNumber"
					bind:value={$editUserForm.phoneNumber}
					{...$constraints.phoneNumber}
					on:change={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-primary font-medium"> Email </span>
				<input
					disabled
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="email"
					value={$page.data.session?.authUser.email}
				/>
			</label>

			<label class="grid gap-2">
				<span class="text-primary font-medium"> Address </span>
				<input
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="address"
					bind:value={$editUserForm.address}
					{...$constraints.address}
					on:change={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-primary font-medium"> Date of Birth </span>
				<input
					type="date"
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="dateOfBirth"
					bind:value={$editUserForm.dateOfBirth}
					{...$constraints.dateOfBirth}
					on:change={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-primary font-medium"> Blood Type </span>
				<input
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="bloodType"
					bind:value={$editUserForm.bloodType}
					{...$constraints.bloodType}
					on:change={() => (editable = true)}
				/>
			</label>
			<label class="grid gap-2">
				<span class="text-primary font-medium"> Height </span>
				<input
					type="number"
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="height"
					bind:value={$editUserForm.height}
					{...$constraints.height}
					on:change={() => (editable = true)}
				/>
			</label>
		</div>
		<button
			class="bg-primary text-white justify-self-center rounded-md py-2 px-24 mt-6"
			type="submit">Edit</button
		>
	</form>
	<form
		method="post"
		action="?/editPassword"
		class="mt-12 border-[1px] border-danger border-dashed p-4 rounded-2xl grid justify-items-stretch"
		use:enhance={({ formData, cancel }) => {
			const newPassword = formData.get('newPassword');
			const confirmNewPassword = formData.get('confirmPassword');
			if (newPassword !== confirmNewPassword) {
				cancel();
				toast.push('New password and confirm password must be the same');
			}
		}}
	>
		<p class="justify-self-center text-2xl text-primary font-medium mb-4">Change Password</p>
		<div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
			<label class="grid gap-2">
				<input
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="oldPassword"
					placeholder="Previous Password"
					on:change={() => (editable = true)}
					minlength="8"
					type="password"
				/>
			</label>
			<label class="grid gap-2">
				<input
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="newPassword"
					placeholder="New Password"
					on:change={() => (editable = true)}
					minlength="8"
					type="password"
				/>
			</label>
			<label class="grid gap-2">
				<input
					class=" border-[1px] border-primary/60 rounded-md p-2"
					name="confirmPassword"
					placeholder="Confirm Password"
					on:change={() => (editable = true)}
					minlength="8"
					type="password"
				/>
			</label>
		</div>
		<button
			class="bg-primary text-white justify-self-center rounded-md py-2 px-10 mt-6"
			type="submit">Change Password</button
		>
	</form>
</div>

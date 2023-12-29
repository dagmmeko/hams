<script lang="ts">
	import { page } from '$app/stores';
	$: console.log($page.data.session?.authUser);
</script>

<form class="mx-10 my-12 items-start bg-white rounded-xl p-8">
	<div class="text-2xl text-primary mb-6">Account Setting</div>
	<div class="grid grid-cols-3 gap-4">
		<label class="grid gap-2">
			<span class="text-primary font-medium"> Username </span>
			<input
				class="w-96 border-[1px] border-primary/60 rounded-md p-2"
				name="userName"
				value={$page.data.session?.authUser.userName}
			/>
		</label>
		<label class="grid gap-2">
			<span class="text-primary font-medium"> Phone Number </span>
			<input
				class="w-96 border-[1px] border-primary/60 rounded-md p-2"
				name="phoneNumber"
				value={$page.data.session?.authUser.phoneNumber}
			/>
		</label>
		<label class="grid gap-2">
			<span class="text-primary font-medium"> Email </span>
			<input
				disabled
				class="w-96 border-[1px] border-primary/60 rounded-md p-2"
				name="email"
				value={$page.data.session?.authUser.email}
			/>
		</label>

		<label class="grid gap-2">
			<span class="text-primary font-medium"> Address </span>
			<input
				class="w-96 border-[1px] border-primary/60 rounded-md p-2"
				name="address"
				value={$page.data.session?.authUser.Employee.address}
			/>
		</label>
		<label class="grid gap-2">
			<span class="text-primary font-medium"> Date of Birth </span>
			<input
				type="date"
				class="w-96 border-[1px] border-primary/60 rounded-md p-2"
				name="dateOfBirth"
				value={$page.data.session?.authUser.Employee.dateOfBirth}
			/>
		</label>
		<label class="grid gap-2">
			<span class="text-primary font-medium"> Blood Type </span>
			<input
				class="w-96 border-[1px] border-primary/60 rounded-md p-2"
				name="bloodType"
				value={$page.data.session?.authUser.Employee.bloodType}
			/>
		</label>
		<label class="grid gap-2">
			<span class="text-primary font-medium"> Height </span>
			<input
				class="w-96 border-[1px] border-primary/60 rounded-md p-2"
				name="height"
				value={$page.data.session?.authUser.Employee.height}
			/>
		</label>
	</div>
	<button class="bg-primary text-white w-96 rounded-md py-2 mt-6" type="submit">Edit</button>
</form>

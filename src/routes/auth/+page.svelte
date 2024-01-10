<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '$lib/assets/Logo.svg.svelte';
	export let data;
	import { signIn } from '@auth/sveltekit/client';

	let email: string;
	let password: string;
	const login = async () => {
		const auth = await signIn('credentials', {
			callbackUrl: '/',
			email: email,
			password: password
		});
	};
</script>

<div class="bg-ghost h-screen w-full grid items-center justify-center">
	<div class="bg-white p-6">
		<div class="grid justify-center mb-6"><Logo /></div>
		<div>
			<p class="text-xl font-semibold">Login</p>
			<p class="text-sm text-subtitle pt-2">Login to you company account</p>
		</div>
		<form class="grid gap-6 mt-6" method="post" use:enhance={() => login()}>
			<label class="grid">
				<span> Email </span>
				<input
					required
					bind:value={email}
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
					name="email"
					type="email"
				/>
			</label>
			<label class="grid">
				<span> Password </span>
				<input
					required
					bind:value={password}
					class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
					type="password"
					name="password"
				/>
			</label>
			<button class="bg-primary w-full text-white rounded-md py-2"> Login</button>
		</form>
	</div>
</div>

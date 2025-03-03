<script lang="ts">
	import Logo from '$lib/assets/Logo.svg.svelte'
	import { signIn } from '@auth/sveltekit/client'

	let email: string | undefined = $state()
	let password: string | undefined = $state()
	const login = async () => {
		const auth = await signIn('credentials', {
			callbackUrl: '/',
			email: email,
			password: password,
		})
	}
</script>

<div class="grid h-screen w-full items-center justify-center bg-ghost">
	<div class="bg-white p-6">
		<div class="mb-6 grid justify-center"><Logo /></div>
		<div>
			<p class="text-xl font-semibold">Login</p>
			<p class="pt-2 text-sm text-subtitle">Login to you company account</p>
		</div>
		<form
			class="mt-6 grid gap-6"
			method="post"
			action="#"
			onsubmit={(e) => {
				e.preventDefault()
				login()
			}}
		>
			<label class="grid">
				<span> Email </span>
				<input
					required
					bind:value={email}
					class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					name="email"
					type="email"
				/>
			</label>
			<label class="grid">
				<span> Password </span>
				<input
					required
					bind:value={password}
					class="mt-2 w-[420px] rounded-md border-[1px] border-black/60 p-2"
					type="password"
					name="password"
				/>
			</label>
			<button type="submit" class="w-full rounded-md bg-primary py-2 text-white"> Login</button>
		</form>
	</div>
</div>

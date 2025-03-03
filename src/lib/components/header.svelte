<script>
	import UserSetting from '$lib/assets/user-setting.svg.svelte'
	import { page } from '$app/state'
</script>

<div class="flex h-16 w-full items-center justify-end bg-white pr-12">
	<a href="/edit-account" class="flex w-fit gap-2 hover:cursor-pointer hover:text-primary">
		<UserSetting />
		<span>{page.data.session?.authUser.userName}</span>
	</a>
</div>

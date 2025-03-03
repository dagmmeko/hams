<script>
	import UserSetting from '$lib/assets/user-setting.svg.svelte';
	import { page } from '$app/state';
</script>

<div class="h-16 bg-white w-full flex items-center justify-end pr-12">
	<a href="/edit-account" class="w-fit flex gap-2 hover:text-primary hover:cursor-pointer">
		<UserSetting />
		<span>{page.data.session?.authUser.userName}</span>
	</a>
</div>

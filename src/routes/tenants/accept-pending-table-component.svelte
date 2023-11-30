<script lang="ts">
	import { enhance } from '$app/forms';

	export let row: any;
</script>

<form
	method="post"
	action="?/acceptPending"
	use:enhance={({ formData }) => {
		formData.set('priceChangeId', row.id.toString());
	}}
>
	<button class="bg-primary p-[6px] rounded-md text-sm text-center text-white/90 w-full">
		Accept
	</button>
</form>

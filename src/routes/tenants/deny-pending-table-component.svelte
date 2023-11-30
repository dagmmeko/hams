<script lang="ts">
	import { enhance } from '$app/forms';

	export let row: any;
</script>

<form
	method="post"
	action="?/denyPending"
	use:enhance={({ formData }) => {
		formData.set('priceChangeId', row.id.toString());
	}}
	class="flex justify-center"
>
	<button class="border-danger border-[1px] p-1 rounded-md mx-2 text-sm text-center w-full">
		Deny
	</button>
</form>

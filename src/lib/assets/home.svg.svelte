<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<svg
	class={className}
	width="24"
	height="25"
	viewBox="0 0 24 25"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M9 22.0555V12.0555H15V22.0555M3 9.05554L12 2.05554L21 9.05554V20.0555C21 20.586 20.7893 21.0947 20.4142 21.4698C20.0391 21.8448 19.5304 22.0555 19 22.0555H5C4.46957 22.0555 3.96086 21.8448 3.58579 21.4698C3.21071 21.0947 3 20.586 3 20.0555V9.05554Z"
		stroke="white"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

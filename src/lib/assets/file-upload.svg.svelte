<script lang="ts">
	interface Props {
		class?: string
	}

	let { class: className = '' }: Props = $props()
</script>

<svg
	class={className}
	width="30"
	height="30"
	viewBox="0 0 30 30"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M17.5 2.5V10H25M15 15V22.5M15 15L18.75 18.75M15 15L11.25 18.75M18.125 2.5H7.5C6.83696 2.5 6.20107 2.76339 5.73223 3.23223C5.26339 3.70107 5 4.33696 5 5V25C5 25.663 5.26339 26.2989 5.73223 26.7678C6.20107 27.2366 6.83696 27.5 7.5 27.5H22.5C23.163 27.5 23.7989 27.2366 24.2678 26.7678C24.7366 26.2989 25 25.663 25 25V9.375L18.125 2.5Z"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

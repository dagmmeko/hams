<script lang="ts">
	interface Props {
		class?: string
	}

	let { class: className = '' }: Props = $props()
</script>

<svg
	class={className}
	width="8"
	height="8"
	viewBox="0 0 8 8"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g id="_Dot">
		<circle id="Dot" cx="4.00002" cy="4" r="3" fill="currentColor" />
	</g>
</svg>

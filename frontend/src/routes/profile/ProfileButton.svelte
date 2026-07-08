<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		label: string;
	}

	let { label }: Props = $props();
</script>

<form
	method="POST"
	action="?/moi"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
		};
	}}
>
	<button type="submit" class="btn cursor-pointer no-underline btn-primary">{label}</button>
</form>

<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		label: string;
		destination: string;
		logOut: boolean;
	}

	let { label, destination, logOut }: Props = $props();
</script>

{#if !logOut}
	<a href={destination} class="btn">{label}</a>
{:else}
	<form
		method="POST"
		action="/?/logout"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
	>
		<button type="submit" class="btn">{label}</button>
	</form>
{/if}

<style>
	button {
		cursor: pointer;
	}
</style>

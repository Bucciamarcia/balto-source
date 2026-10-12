<script lang="ts">
	import { enhance } from '$app/forms';
	import { localizeHref } from '$lib/paraglide/runtime';

	interface Props {
		label: string;
		destination: string;
		logOut: boolean;
	}

	let { label, destination, logOut }: Props = $props();
</script>

{#if !logOut}
	<a href={destination} class="btn no-underline btn-primary">{label}</a>
{:else}
	<form
		method="POST"
		action={localizeHref('/hub/profile?/logout')}
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
	>
		<button type="submit" class="btn cursor-pointer btn-primary">{label}</button>
	</form>
{/if}

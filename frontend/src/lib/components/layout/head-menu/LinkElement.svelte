<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Source } from '#lib/components/getSourceSlug.js';
	import { localizeHref } from '#lib/paraglide/runtime.js';

	interface Props {
		label: string;
		destination: string;
		logOut: boolean;
		source: Source;
	}

	let { label, destination, logOut, source }: Props = $props();
</script>

{#if !logOut}
	<a href={destination} class="btn no-underline btn-primary">{label}</a>
{:else}
	<form
		method="POST"
		action={localizeHref(`/${source}/profile?/logout`)}
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
	>
		<button type="submit" class="btn cursor-pointer btn-primary">{label}</button>
	</form>
{/if}

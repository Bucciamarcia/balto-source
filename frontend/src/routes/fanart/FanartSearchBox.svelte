<script lang="ts">
	import { enhance } from '$app/forms';

	let { action = '?/default' }: { action?: string } = $props();
</script>

<p class="mb-3 text-xl">Search</p>
<form class="mb-5" method="POST" {action} use:enhance>
	<input
		type="text"
		name="filter"
		class="input text-black"
		placeholder="Search by author or title"
	/>
	<button type="submit" class="btn btn-primary">Search</button>
	<button type="submit" formaction="?/clear" class="btn btn-error">Clear results</button>
</form>

<script lang="ts">
	import { enhance } from '$app/forms';

	let { action = '?/default' }: { action?: string } = $props();
</script>

<p class="mb-3 text-xl">Filter the results</p>
<form class="mb-5 gap-3" method="POST" {action} use:enhance>
	<input type="text" name="filter" class="input" placeholder="Filter by author or title" />
</form>

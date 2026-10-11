<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
</script>

<p>
	{m.upload_error({
		code: page.status,
		error: page.error?.message ?? 'unknown error'
	})}
</p>

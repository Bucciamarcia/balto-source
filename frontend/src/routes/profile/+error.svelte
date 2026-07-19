<script lang="ts">
	import { page } from '$app/state';
</script>

<p>Error: {page.status} - {page.error?.message}</p>

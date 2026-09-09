<script lang="ts">
	import { page } from '$app/state';
</script>

<p>You don't have access to this page: {page.status} - {page.error?.message}</p>

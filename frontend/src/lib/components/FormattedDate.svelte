<script lang="ts">
	import { format } from 'date-fns';

	function formatDate(d: Date): string {
		return format(d, 'MMM d, yyyy');
	}

	let { date }: { date: Date } = $props();
</script>

{formatDate(date)}

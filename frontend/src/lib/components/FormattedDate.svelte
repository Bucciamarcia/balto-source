<script lang="ts">
	import { format } from 'date-fns';

	function formatDate(d: Date, showTime: boolean): string {
		if (showTime) {
			return format(d, 'MMM d, yyyy HH:mm:ss');
		} else {
			return format(d, 'MMM d, yyyy');
		}
	}

	let { date, showTime = false }: { date: Date; showTime?: boolean } = $props();
</script>

{formatDate(date, showTime)}

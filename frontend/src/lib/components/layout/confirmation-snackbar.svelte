<script lang="ts">
	let { message }: { message?: string } = $props();
	let visible = $state(false);

	$effect(() => {
		if (message) {
			visible = true;
			const timer = setTimeout(() => (visible = false), 3000);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if visible && message}
	<div
		role="status"
		class="animate-fade-in fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-white shadow-lg"
	>
		{message}
	</div>
{/if}

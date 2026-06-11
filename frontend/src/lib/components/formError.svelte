<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<p role="alert" class="mt-1 text-sm text-red-600">{message}</p>

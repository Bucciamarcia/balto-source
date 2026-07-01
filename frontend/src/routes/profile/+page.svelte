<script lang="ts">
	let { data } = $props();
	// svelte-ignore state_referenced_locally
	const uid: string = data.toReturn;
</script>

{#if uid == ''}
	<p>You need to be logged in to view your profile</p>
{:else}
	<p>Your uid: {uid}</p>
{/if}

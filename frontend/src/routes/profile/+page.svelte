<script lang="ts">
	let { data } = $props();
</script>

{#if data.status === 400}
	<p>You need to log in to see your profile</p>
{:else if data.status === 404}
	<p>User not found</p>
{:else}
	<p>Your uid: {data.user?.username}</p>
{/if}

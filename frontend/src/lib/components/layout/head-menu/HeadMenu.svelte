<script lang="ts">
	import LinkElement from './LinkElement.svelte';
	let { isLoggedIn, isVerified }: { isLoggedIn: boolean; isVerified: boolean } = $props();
</script>

<div class="mt-4 flex gap-4 place-self-center">
	<LinkElement label="Home page" destination="/" logOut={false} />
	{#if !isLoggedIn}
		<LinkElement label="Log in" destination="/login" logOut={false} />
		<LinkElement label="Sign up" destination="/signup" logOut={false} />
	{/if}
	<LinkElement label="Shout box" destination="/shoutbox" logOut={false} />
	{#if isLoggedIn && isVerified}
		<LinkElement label="Profile" destination="/profile" logOut={false} />
		<LinkElement label="Upload" destination="/upload" logOut={false} />
		<LinkElement label="Log out" destination="/" logOut={true} />
	{/if}
</div>

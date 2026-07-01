<script>
	import LinkElement from './Link-element.svelte';
</script>

<div class="mt-4 flex gap-4 place-self-center">
	<LinkElement label="Home page" destination="/" logOut={false} />
	<LinkElement label="Log in" destination="/login" logOut={false} />
	<LinkElement label="Sign up" destination="/signup" logOut={false} />
	<LinkElement label="Shout box" destination="/shoutbox" logOut={false} />
	<LinkElement label="Profile" destination="/profile" logOut={false} />
	<LinkElement label="Log out" destination="/" logOut={true} />
</div>

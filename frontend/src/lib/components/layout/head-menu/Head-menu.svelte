<script>
	import LinkElement from './Link-element.svelte';
</script>

<div class="flex gap-4 place-self-center">
	<LinkElement label="Home page" destination="/" logOut={false} />
	<LinkElement label="Log in" destination="/login" logOut={false} />
	<LinkElement label="Sign up" destination="/sign up" logOut={false} />
	<LinkElement label="Log out" destination="/" logOut={true} />
</div>

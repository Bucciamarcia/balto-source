<script>
	import LinkElement from './Link-element.svelte';
</script>

<div class="menu">
	<LinkElement label="Log in" destination="/login" logOut={false} />
	<LinkElement label="Sign up" destination="/sign up" logOut={false} />
	<LinkElement label="Log out" destination="/" logOut={true} />
</div>

<style>
	.menu {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

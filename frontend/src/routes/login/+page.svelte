<script lang="ts">
	import { enhance } from '$app/forms';

	let email: string = $state('');
	let password: string = $state('');

	let { data } = $props();
	let loggedUser: string = $derived(data.loggedUser);
</script>

<form method="POST" action="?/login" use:enhance>
	<input name="email" type="email" bind:value={email} placeholder="Your email address" />
	<input name="password" type="password" bind:value={password} placeholder="Your password" />
	<button type="submit">Submit</button>
</form>

<p>Logged status: {loggedUser}</p>

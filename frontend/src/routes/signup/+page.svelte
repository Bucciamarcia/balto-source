<script lang="ts">
	import { enhance } from '$app/forms';
	let email: string = $state('');
	let username: string = $state('');
	let password: string = $state('');
</script>

<form method="POST" action="?/createUser" use:enhance>
	<input name="email" type="email" bind:value={email} placeholder="Your email address" />
	<input name="username" type="text" bind:value={username} placeholder="Your username" />
	<input name="password" type="password" bind:value={password} placeholder="Your password" />
	<button type="submit">Submit</button>
</form>

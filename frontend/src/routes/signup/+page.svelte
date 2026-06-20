<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	let email: string = $state('');
	let username: string = $state('');
	let password: string = $state('');
	let passwordConfirm: string = $state('');
	let { data, form } = $props();
	let loggedUser: string | null = $derived(data.loggedUser);
</script>

{#if !loggedUser}
	<form method="POST" action="?/createUser" use:enhance>
		<input name="email" type="email" bind:value={email} placeholder="Your email address" />
		<input name="username" type="text" bind:value={username} placeholder="Your username" />
		<input name="password" type="password" bind:value={password} placeholder="Your password" />
		<input
			name="passwordConfirm"
			type="password"
			bind:value={passwordConfirm}
			placeholder="Confirm password"
		/>
		<button type="submit">Submit</button>
	</form>
	{#if form?.message}
		<FormError message={form.message} />
	{/if}
{:else}
	<p>You are already logged in</p>
{/if}

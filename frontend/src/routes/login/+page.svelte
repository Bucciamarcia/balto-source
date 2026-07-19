<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';

	let email: string = $state('');
	let password: string = $state('');

	let { data, form } = $props();
	let loggedUser: string | null = $derived(data.loggedUser);
</script>

<svelte:head>
	<title>Login - Balto Source</title>
</svelte:head>
{#if !loggedUser}
	<form method="POST" action="?/login" use:enhance>
		<input
			class="text-black"
			name="email"
			type="email"
			bind:value={email}
			placeholder="Your email address"
		/>
		<input
			class="text-black"
			name="password"
			type="password"
			bind:value={password}
			placeholder="Your password"
		/>
		<button class="btn cursor-pointer btn-primary" type="submit">Submit</button>
	</form>
	{#if form?.message}
		<FormError message={form.message} />
	{/if}
{:else}
	<p>You are already logged in</p>
{/if}

<p>Logged status: {loggedUser ?? 'Not logged in'}</p>

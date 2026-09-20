<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { m } from '$lib/paraglide/messages.js';

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
			placeholder={m.login_email_place()}
		/>
		<input
			class="text-black"
			name="password"
			type="password"
			bind:value={password}
			placeholder={m.login_pass_place()}
		/>
		<button class="btn cursor-pointer btn-primary" type="submit">{m.login_confirm()}</button>
	</form>
	{#if form?.message}
		<FormError message={form.message} />
	{/if}
{:else}
	<p>{m.drunken_sailor()}</p>
{/if}

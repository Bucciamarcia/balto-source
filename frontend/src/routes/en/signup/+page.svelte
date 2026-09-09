<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$lib/components/formError.svelte';
	import { TURNSTILE_PUBLIC_KEY } from '$lib/consts.js';
	import { Turnstile } from 'svelte-turnstile';
	let email: string = $state('');
	let username: string = $state('');
	let password: string = $state('');
	let passwordConfirm: string = $state('');
	let isLoading: boolean = $state(false);
	let { data, form } = $props();
	let loggedUser: string | null = $derived(data.loggedUser);
</script>

<svelte:head>
	<title>Sign up - Balto Source</title>
</svelte:head>
{#if !loggedUser}
	<form
		method="POST"
		action="?/createUser"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
	>
		<input
			class="text-black"
			name="email"
			type="email"
			bind:value={email}
			placeholder="Your email address"
		/>
		<input
			class="text-black"
			name="username"
			type="text"
			bind:value={username}
			placeholder="Your username"
		/>
		<input
			name="password"
			class="text-black"
			type="password"
			bind:value={password}
			placeholder="Your password"
		/>
		<input
			class="text-black"
			name="passwordConfirm"
			type="password"
			bind:value={passwordConfirm}
			placeholder="Confirm password"
		/>
		{#if isLoading}
			<span class="loading loading-spinner text-primary"></span>
		{:else}
			<button class="btn cursor-pointer btn-primary" type="submit">Submit</button>
		{/if}
		<Turnstile siteKey={TURNSTILE_PUBLIC_KEY} />
	</form>
	{#if form?.message}
		<FormError message={form.message} />
	{/if}
{:else}
	<p>You are already logged in</p>
{/if}
{#if form?.success}
	<p class="mt-4 text-lg font-semibold text-green-600">
		Registration successful! Confirm your email address to activate your account.
	</p>
{/if}

<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import { enhance } from '$app/forms';
	import SideMenu from '$lib/components/layout/SideMenu.svelte';
	import HeadBanner from '$lib/components/layout/head-banner.svelte';
	import HeadMenu from '$lib/components/layout/head-menu/HeadMenu.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import titleIcon from '$lib/assets/placeholderTitleIcon.png';
	import { m } from '$lib/paraglide/messages.js';

	let { children, data } = $props();
	let newEmailVerificationYes: boolean = $state(false);
</script>

<svelte:head>
	<!-- <link href={favicon} rel="icon"/> -->
	<link href={titleIcon} rel="icon" type="image/png" />
</svelte:head>

<!-- Outer Container: Stacks things vertically -->

<div class="mainbg flex min-h-screen flex-col overflow-x-auto">
	<!-- Top Bar: Takes up 100% width automatically -->

	<div class="mx-auto min-w-[780px] self-center p-4 pr-10 pl-10 text-white">
		<HeadBanner />

		<HeadMenu
			isLoggedIn={data.isLoggedIn}
			isVerified={data.user?.verified == true}
			newNotifications={data.newNotificationsCount}
			latestNotifications={data.latestNotifications}
			language={data.language}
		/>

		{#if data.user?.verified === false}
			<form
				method="POST"
				action="/?/resendVerificationEmail"
				use:enhance={() => {
					newEmailVerificationYes = false;

					return async ({ result, update }) => {
						await update();

						if (result.type === 'success') {
							newEmailVerificationYes = true;
						}
					};
				}}
			>
				<div class="mt-10 place-self-center text-lg font-bold text-error">
					{m.account_inactive()}
				</div>

				<input name="email" type="hidden" value={data.user.email} />

				<div class="mt-5 place-self-center">
					<button class="btn cursor-pointer btn-primary" type="submit">
						{m.home_send_v()}
					</button>
				</div>

				{#if newEmailVerificationYes}
					<div class="mt-5 place-self-center text-lg font-bold text-black">
						{m.home_v_sent()}
					</div>
				{/if}
			</form>
		{/if}
	</div>

	<!-- Bottom Section: Holds the columns side-by-side -->

	<div class="flex flex-1 flex-nowrap items-start">
		<!-- Left Column (Stays as small as SideMenu allows) -->
		<SideMenu language={data.language} />
		<!-- Right Column (Fills the rest) -->

		<main
			class="container m-20 rounded-md border-3 border-solid border-primary bg-neutral/75 px-20 py-10"
		>
			{@render children()}
		</main>
	</div>

	<div class="flex flex-1"><Footer /></div>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<style>
	.mainbg {
		background-image: url('$lib/assets/main-background-image.avif');
	}
</style>

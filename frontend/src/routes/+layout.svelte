<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import './layout.css';
	import { enhance } from '$app/forms';
	import SideMenu from '#lib/components/layout/SideMenu.svelte';
	import HamburgerMenu from '#lib/components/layout/HamburgerMenu.svelte';
	import HeadMenu from '#lib/components/layout/head-menu/HeadMenu.svelte';
	import Footer from '#lib/components/layout/footer.svelte';
	import titleIcon from '#lib/assets/placeholderTitleIcon.png';
	import { m } from '#lib/paraglide/messages.js';
	import { shouldDisplaySnow } from '#lib/components/christmas/shouldDisplaySnow.js';

	let { children, data } = $props();
	let newEmailVerificationYes: boolean = $state(false);
</script>

<svelte:head>
	<!-- <link href={favicon} rel="icon"/> -->
	<link href={titleIcon} rel="icon" type="image/png" />
	{#if data.themeCss}
		{@html `<style>:root{${data.themeCss}}</style>`}
	{/if}
</svelte:head>

<!-- Outer Container: Stacks things vertically -->

<div style="background-image: url({data.bgUrl})" class="flex min-h-screen flex-col overflow-x-auto">
	<!-- Top Bar: Takes up 100% width automatically -->

	<div class="mx-auto min-w-[780px] self-center p-4 pr-10 pl-10 text-white">
		<a href="/{data.language}/{data.source}" aria-label={m.img_ban_tit()}>
			<img src={data.bannerUrl} alt={m.img_ban_alt()} />
		</a>

		<HeadMenu
			isLoggedIn={data.isLoggedIn}
			isVerified={data.user?.verified == true}
			newNotifications={data.newNotificationsCount}
			latestNotifications={data.latestNotifications}
			language={data.language}
			source={data.source}
		/>

		{#if data.user?.verified === false}
			<form
				method="POST"
				action={localizeHref(`/${data.source}/profile?/resendVerificationEmail`)}
				use:enhance={() => {
					newEmailVerificationYes = false;

					return async ({ result, update }) => {
						await update({ navigate: false });

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
		<div class="hidden md:block">
			<SideMenu language={data.language} source={data.source} />
		</div>

		<div class="flex md:hidden">
			<HamburgerMenu source={data.source} />
		</div>

		<!-- Right Column (Fills the rest) -->

		<main
			class="container m-10 min-w-[600px] rounded-md border-3 border-solid border-accent bg-neutral/75 px-20 py-10"
		>
			{@render children()}
		</main>
	</div>

	<div class="mx-auto flex min-w-[780px] flex-1"><Footer /></div>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }).slice(1) as Path)}>{locale}</a>
	{/each}
</div>
{#if shouldDisplaySnow(data.snowCookie)}
	<div class="snowflakes" aria-hidden="true">
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
		<div class="snowflake">
			<div class="inner">❅</div>
		</div>
	</div>
{/if}

<style>
	.snowflake {
		color: #fff;
		font-size: 1em;
		font-family: Arial, sans-serif;
		text-shadow: 0 0 5px #000;
	}

	.snowflake,
	.snowflake .inner {
		animation-iteration-count: infinite;
		animation-play-state: running;
	}
	@keyframes snowflakes-fall {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(110vh);
		}
	}
	@keyframes snowflakes-shake {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(80px);
		}
	}
	.snowflake {
		position: fixed;
		top: -10%;
		z-index: 9999;
		-webkit-user-select: none;
		user-select: none;
		cursor: default;
		pointer-events: none;
		animation-name: snowflakes-shake;
		animation-duration: 3s;
		animation-timing-function: ease-in-out;
	}
	.snowflake .inner {
		animation-duration: 10s;
		animation-name: snowflakes-fall;
		animation-timing-function: linear;
	}
	.snowflake:nth-of-type(0) {
		left: 1%;
		animation-delay: 0s;
	}
	.snowflake:nth-of-type(0) .inner {
		animation-delay: 0s;
	}
	.snowflake:first-of-type {
		left: 10%;
		animation-delay: 1s;
	}
	.snowflake:first-of-type .inner,
	.snowflake:nth-of-type(8) .inner {
		animation-delay: 1s;
	}
	.snowflake:nth-of-type(2) {
		left: 20%;
		animation-delay: 0.5s;
	}
	.snowflake:nth-of-type(2) .inner,
	.snowflake:nth-of-type(6) .inner {
		animation-delay: 6s;
	}
	.snowflake:nth-of-type(3) {
		left: 30%;
		animation-delay: 2s;
	}
	.snowflake:nth-of-type(11) .inner,
	.snowflake:nth-of-type(3) .inner {
		animation-delay: 4s;
	}
	.snowflake:nth-of-type(4) {
		left: 40%;
		animation-delay: 2s;
	}
	.snowflake:nth-of-type(10) .inner,
	.snowflake:nth-of-type(4) .inner {
		animation-delay: 2s;
	}
	.snowflake:nth-of-type(5) {
		left: 50%;
		animation-delay: 3s;
	}
	.snowflake:nth-of-type(5) .inner {
		animation-delay: 8s;
	}
	.snowflake:nth-of-type(6) {
		left: 60%;
		animation-delay: 2s;
	}
	.snowflake:nth-of-type(7) {
		left: 70%;
		animation-delay: 1s;
	}
	.snowflake:nth-of-type(7) .inner {
		animation-delay: 2.5s;
	}
	.snowflake:nth-of-type(8) {
		left: 80%;
		animation-delay: 0s;
	}
	.snowflake:nth-of-type(9) {
		left: 90%;
		animation-delay: 1.5s;
	}
	.snowflake:nth-of-type(9) .inner {
		animation-delay: 3s;
	}
	.snowflake:nth-of-type(10) {
		left: 25%;
		animation-delay: 0s;
	}
	.snowflake:nth-of-type(11) {
		left: 65%;
		animation-delay: 2.5s;
	}
</style>

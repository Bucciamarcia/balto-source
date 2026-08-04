<script lang="ts">
	import BellIcon from './BellIcon.svelte';
	import LinkElement from './LinkElement.svelte';
	import type { NotificationsResponse } from '$lib/pocketbase-types';
	import Notifications from './Notifications.svelte';
	let {
		isLoggedIn,
		isVerified,
		newNotifications,
		latestNotifications
	}: {
		isLoggedIn: boolean;
		isVerified: boolean;
		newNotifications: number;
		latestNotifications: NotificationsResponse[];
	} = $props();
</script>

<div class="mt-4 flex gap-4 place-self-center">
	<LinkElement label="Home page" destination="/" logOut={false} />
	{#if !isLoggedIn}
		<LinkElement label="Log in" destination="/login" logOut={false} />
		<LinkElement label="Sign up" destination="/signup" logOut={false} />
	{/if}
	<LinkElement label="Shout box" destination="/shoutbox" logOut={false} />
	{#if isLoggedIn && isVerified}
		<LinkElement label="Profile" destination="/profile" logOut={false} />
		<LinkElement label="Upload" destination="/upload" logOut={false} />
		<LinkElement label="Log out" destination="/" logOut={true} />
		<div class="tooltip" data-tip="Notifications">
			<div class="indicator">
				<span class="indicator-item badge badge-error">{newNotifications}</span>
				<details class="dropdown dropdown-end">
					<summary class="btn btn-primary"><BellIcon /></summary>
					<div class="dropdown-content grid h-120 w-100 bg-base-300">
						<Notifications notifications={latestNotifications} />
					</div>
				</details>
			</div>
		</div>
	{/if}
</div>

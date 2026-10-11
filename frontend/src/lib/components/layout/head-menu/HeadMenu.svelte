<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BellIcon from './BellIcon.svelte';
	import LinkElement from './LinkElement.svelte';
	import type { NotificationsResponse, UsersResponse } from '$lib/pocketbase-types';
	import Notifications from './Notifications.svelte';
	import type { Action } from 'svelte/action';
	import type { Locale } from '$lib/paraglide/runtime';
	import type { Source } from '$lib/components/getSourceSlug';
	let {
		isLoggedIn,
		isVerified,
		newNotifications,
		latestNotifications,
		language,
		source
	}: {
		isLoggedIn: boolean;
		isVerified: boolean;
		newNotifications: number;
		latestNotifications: NotificationsResponse<{ source_user: UsersResponse }>[];
		language: Locale;
		source: Source;
	} = $props();
	const clickOutside: Action<HTMLElement, () => void> = (node, callback) => {
		function handleClick(event: MouseEvent) {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				callback();
			}
		}
		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			},
			update(newCallback: () => void) {
				callback = newCallback;
			}
		};
	};
	let isOpen: boolean = $state(false);
</script>

<div class="mt-4 flex gap-4 place-self-center">
	<LinkElement label={m.menu_home()} destination="/{language}" logOut={false} />
	{#if !isLoggedIn}
		<LinkElement label={m.menu_login()} destination="/{language}/{source}/login" logOut={false} />
		<LinkElement label={m.menu_signup()} destination="/{language}/{source}/signup" logOut={false} />
	{/if}
	<LinkElement label={m.menu_shout()} destination="/{language}/{source}/shoutbox" logOut={false} />
	{#if isLoggedIn && isVerified}
		<LinkElement
			label={m.menu_profile()}
			destination="/{language}/{source}/profile"
			logOut={false}
		/>
		<LinkElement label={m.menu_upload()} destination="/{language}/{source}/upload" logOut={false} />
		<LinkElement label={m.menu_logout()} destination="/{language}/{source}/" logOut={true} />
		<div class="tooltip" use:clickOutside={() => (isOpen = false)} data-tip={m.menu_noti()}>
			<div class="indicator">
				<span
					class="indicator-item badge {newNotifications === 0 ? 'badge-secondary' : 'badge-error'}"
					>{newNotifications}</span
				>
				<details bind:open={isOpen} class="dropdown dropdown-end">
					<summary class="btn btn-primary"><BellIcon /></summary>
					<div class="dropdown-content grid h-120 w-100 content-start overflow-y-auto bg-base-300">
						<Notifications notifications={latestNotifications} />
					</div>
				</details>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	import BellIcon from './BellIcon.svelte';
	import LinkElement from './LinkElement.svelte';
	import type { NotificationsResponse, UsersResponse } from '$lib/pocketbase-types';
	import Notifications from './Notifications.svelte';
	import type { Action } from 'svelte/action';
	let {
		isLoggedIn,
		isVerified,
		newNotifications,
		latestNotifications,
		language
	}: {
		isLoggedIn: boolean;
		isVerified: boolean;
		newNotifications: number;
		latestNotifications: NotificationsResponse<{ source_user: UsersResponse }>[];
		language: LanguageStub;
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
	<LinkElement label="Home page" destination="/{language}" logOut={false} />
	{#if !isLoggedIn}
		<LinkElement label="Log in" destination="/{language}/login" logOut={false} />
		<LinkElement label="Sign up" destination="/{language}/signup" logOut={false} />
	{/if}
	<LinkElement label="Shout box" destination="/{language}/shoutbox" logOut={false} />
	{#if isLoggedIn && isVerified}
		<LinkElement label="Profile" destination="/{language}/profile" logOut={false} />
		<LinkElement label="Upload" destination="/{language}/upload" logOut={false} />
		<LinkElement label="Log out" destination="/{language}/" logOut={true} />
		<div class="tooltip" use:clickOutside={() => (isOpen = false)} data-tip="Notifications">
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

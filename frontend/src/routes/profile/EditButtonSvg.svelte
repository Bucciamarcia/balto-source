<script lang="ts">
	interface Props {
		editMode: boolean;
		flipMode: () => void;
		onUsernameChanged: () => void;
	}
	let { editMode, flipMode, onUsernameChanged }: Props = $props();
</script>

{#if editMode === false}
	<button aria-label="Change username" class="cursor-pointer" onclick={flipMode}>
		<div class="tooltip ml-5 self-center" data-tip="Change your username">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2.5"
				stroke="currentColor"
				class="size-[1.2em]"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
				/>
			</svg>
		</div>
	</button>
{:else}
	<div class="flex">
		<button aria-label="Confirm username change" class="cursor-pointer" onclick={onUsernameChanged}>
			<div class="tooltip mr-3 ml-5 self-center" data-tip="Confirm change">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
				</svg>
			</div>
		</button>
		<button aria-label="Cancel username change" class="cursor-pointer" onclick={flipMode}>
			<div class="tooltip self-center" data-tip="Cancel change">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</div>
		</button>
	</div>
{/if}

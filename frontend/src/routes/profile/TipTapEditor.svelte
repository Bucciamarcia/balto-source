<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import { TextStyleKit } from '@tiptap/extension-text-style';

	let { content = '' }: { content?: string | null } = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor | null>(null);
	let editorVersion = $state(0);
	let selectedColor = $state('#ffffff');
	let selectedFontSize = $state('16px');

	const fontSizes = [
		{ label: 'Small', value: '14px' },
		{ label: 'Normal', value: '16px' },
		{ label: 'Large', value: '20px' },
		{ label: 'Extra large', value: '24px' }
	];

	function refreshToolbar(editorInstance: Editor) {
		const textStyle = editorInstance.getAttributes('textStyle');
		selectedColor = textStyle.color || '#ffffff';
		selectedFontSize = textStyle.fontSize || '16px';
		editorVersion += 1;
	}

	function run(command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) {
		if (!editor) return;
		command(editor.chain().focus()).run();
		refreshToolbar(editor);
	}

	function setColor(color: string) {
		selectedColor = color;
		run((chain) => chain.setColor(color));
	}

	function setFontSize(fontSize: string) {
		selectedFontSize = fontSize;
		run((chain) => chain.setFontSize(fontSize));
	}

	function isActive(name: string, attributes: Record<string, unknown> = {}) {
		editorVersion;
		return editor?.isActive(name, attributes) ?? false;
	}

	function canUndo() {
		editorVersion;
		return editor?.can().undo() ?? false;
	}

	function canRedo() {
		editorVersion;
		return editor?.can().redo() ?? false;
	}

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [StarterKit, TextStyleKit],
			content,
			editorProps: {
				attributes: {
					class: 'editor-content',
					'aria-label': 'Profile bio editor'
				}
			},
			onCreate: ({ editor: editorInstance }) => {
				editorInstance.commands.setColor('#ffffff');
				refreshToolbar(editorInstance);
			},
			onTransaction: ({ editor: editorInstance }) => refreshToolbar(editorInstance)
		});
	});

	onDestroy(() => editor?.destroy());
</script>

<section class="bio-editor" aria-label="Edit profile bio">
	<div class="editor-heading">
		<div>
			<p class="eyebrow">Edit your profile</p>
		</div>
		<span class="formatting-note">Formatting is saved with your bio</span>
	</div>

	{#if editor}
		<div class="toolbar" aria-label="Text formatting tools">
			<div class="tool-group">
				<button
					type="button"
					class:active={isActive('bold')}
					aria-label="Bold"
					title="Bold"
					onclick={() => run((chain) => chain.toggleBold())}><strong>B</strong></button
				>
				<button
					type="button"
					class:active={isActive('italic')}
					aria-label="Italic"
					title="Italic"
					onclick={() => run((chain) => chain.toggleItalic())}><em>I</em></button
				>
				<button
					type="button"
					class:active={isActive('strike')}
					aria-label="Strikethrough"
					title="Strikethrough"
					onclick={() => run((chain) => chain.toggleStrike())}><s>S</s></button
				>
			</div>

			<div class="tool-group">
				<button
					type="button"
					class:active={isActive('heading', { level: 2 })}
					aria-label="Heading"
					title="Heading"
					onclick={() => run((chain) => chain.toggleHeading({ level: 2 }))}>H</button
				>
				<button
					type="button"
					class:active={isActive('bulletList')}
					aria-label="Bullet list"
					title="Bullet list"
					onclick={() => run((chain) => chain.toggleBulletList())}>• List</button
				>
				<button
					type="button"
					class:active={isActive('blockquote')}
					aria-label="Quote"
					title="Quote"
					onclick={() => run((chain) => chain.toggleBlockquote())}>“</button
				>
			</div>

			<div class="tool-group text-style-tools">
				<label class="color-control" title="Text colour">
					<span class="sr-only">Text colour</span>
					<input
						type="color"
						value={selectedColor}
						oninput={(event) => setColor(event.currentTarget.value)}
					/>
				</label>
				<label class="size-control">
					<span class="sr-only">Text size</span>
					<select
						value={selectedFontSize}
						onchange={(event) => setFontSize(event.currentTarget.value)}
						aria-label="Text size"
					>
						{#each fontSizes as fontSize}
							<option value={fontSize.value}>{fontSize.label}</option>
						{/each}
					</select>
				</label>
				<button
					type="button"
					aria-label="Clear text styles"
					title="Clear text styles"
					onclick={() =>
						run((chain) => chain.unsetAllMarks().clearNodes().unsetColor().unsetFontSize())}
					>Clear</button
				>
			</div>

			<div class="tool-group history-tools">
				<button
					type="button"
					disabled={!canUndo()}
					aria-label="Undo"
					title="Undo"
					onclick={() => run((chain) => chain.undo())}>Undo</button
				>
				<button
					type="button"
					disabled={!canRedo()}
					aria-label="Redo"
					title="Redo"
					onclick={() => run((chain) => chain.redo())}>Redo</button
				>
			</div>
		</div>
	{/if}

	<div class="editor-surface" bind:this={element}></div>
</section>

<style>
	.bio-editor {
		width: min(100%, 46rem);
		margin: 2rem auto;
		border: 1px solid oklch(0.87 0.02 255);
		border-radius: 1rem;
		background: oklch(28% 0.04 235);
		box-shadow: 0 1.25rem 3rem oklch(0.25 0.04 255 / 0.1);
		overflow: hidden;
	}

	.editor-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem 1rem;
		border-bottom: 1px solid oklch(0.91 0.018 255);
	}

	.eyebrow {
		margin: 0 0 0.25rem;
		color: oklch(0.5 0.13 255);
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.editor-heading h2 {
		margin: 0;
		color: oklch(0.24 0.035 255);
		font-size: 1.3rem;
		font-weight: 700;
	}
	.formatting-note {
		color: oklch(0.53 0.025 255);
		font-size: 0.8rem;
		text-align: right;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.7rem 1rem;
		border-bottom: 1px solid oklch(0.91 0.018 255);
		background: oklch(0.96 0.012 255);
	}
	.tool-group {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		padding-right: 0.5rem;
		border-right: 1px solid oklch(0.84 0.02 255);
	}
	.tool-group:last-child {
		padding-right: 0;
		border-right: 0;
	}
	.toolbar button,
	.toolbar select {
		border: 0;
		border-radius: 0.4rem;
		background: transparent;
		color: oklch(0.32 0.035 255);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 650;
		cursor: pointer;
	}
	.toolbar button {
		min-width: 2rem;
		padding: 0.4rem 0.45rem;
	}
	.toolbar button:hover:not(:disabled),
	.toolbar button.active {
		background: oklch(0.88 0.06 255);
		color: oklch(0.31 0.11 255);
	}
	.toolbar button:focus-visible,
	.toolbar select:focus-visible,
	.color-control:focus-within {
		outline: 2px solid oklch(0.59 0.16 255);
		outline-offset: 2px;
	}
	.toolbar button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.color-control {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		cursor: pointer;
	}
	.color-control input {
		width: 1.15rem;
		height: 1.15rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
	}
	.size-control select {
		height: 2rem;
		padding: 0 0.25rem;
	}
	.editor-surface :global(.editor-content) {
		min-height: 14rem;
		padding: 1.25rem 1.5rem 1.75rem;
		color: oklch(0.28 0.025 255);
		font-size: 1rem;
		line-height: 1.7;
		outline: none;
	}
	.editor-surface :global(.editor-content > :first-child) {
		margin-top: 0;
	}
	.editor-surface :global(.editor-content p.is-editor-empty:first-child::before) {
		content: 'Write a short introduction for your profile…';
		float: left;
		height: 0;
		color: oklch(0.64 0.02 255);
		pointer-events: none;
	}
	.editor-surface :global(.editor-content h2) {
		margin: 1.4rem 0 0.65rem;
		color: oklch(0.23 0.05 255);
		font-size: 1.35rem;
		line-height: 1.25;
	}
	.editor-surface :global(.editor-content ul) {
		padding-left: 1.3rem;
	}
	.editor-surface :global(.editor-content blockquote) {
		margin: 1rem 0;
		padding-left: 1rem;
		border-left: 3px solid oklch(0.65 0.12 255);
		color: oklch(0.4 0.045 255);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 38rem) {
		.editor-heading {
			align-items: start;
			flex-direction: column;
		}
		.formatting-note {
			text-align: left;
		}
		.history-tools {
			display: none;
		}
	}
</style>

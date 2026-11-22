<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import { TextStyleKit } from '@tiptap/extension-text-style';

	let {
		content,
		value = $bindable(content),
		header
	}: { content: string; value: string; header: string } = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor | null>(null);
	let editorVersion = $state(0);
	let selectedColor = $state('');
	let selectedFontSize = $state('16px');

	const fontSizes = [
		{ label: 'Small', value: '14px' },
		{ label: 'Normal', value: '16px' },
		{ label: 'Large', value: '20px' },
		{ label: 'Extra large', value: '24px' }
	];

	function refreshToolbar(editorInstance: Editor) {
		const textStyle = editorInstance.getAttributes('textStyle');
		selectedColor = textStyle.color || '';
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
					class:
						"prose max-w-none min-h-56 px-6 pt-5 pb-7 text-neutral-content focus:outline-none [--tw-prose-body:var(--color-neutral-content)] [--tw-prose-headings:var(--color-neutral-content)] [--tw-prose-bold:var(--color-neutral-content)] [--tw-prose-bullets:var(--color-neutral-content)] [--tw-prose-quotes:var(--color-neutral-content)] [--tw-prose-quote-borders:var(--color-accent)] [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:opacity-50 [&_p.is-editor-empty:first-child::before]:content-['Write_a_short_introduction_for_your_profile…']",
					'aria-label': 'Profile bio editor'
				}
			},
			onCreate: ({ editor: editorInstance }) => {
				editorInstance.commands.setColor('#ffffff');
				refreshToolbar(editorInstance);
			},
			onTransaction: ({ editor: editorInstance }) => refreshToolbar(editorInstance),
			onUpdate: ({ editor }) => {
				value = editor.getHTML();
			}
		});
	});

	onDestroy(() => editor?.destroy());
</script>

<section
	class="mx-auto my-8 w-full max-w-3xl overflow-hidden rounded-box border border-accent bg-neutral text-neutral-content shadow-xl"
	aria-label="Edit profile bio"
>
	<div class="border-b border-base-300/30 px-6 pt-5 pb-4">
		<p class="text-xs font-extrabold tracking-widest text-accent uppercase">{header}</p>
	</div>

	{#if editor}
		<div
			class="flex flex-wrap items-center gap-2 border-b border-base-300/30 bg-base-100/10 px-4 py-2"
			aria-label="Text formatting tools"
		>
			<div class="join">
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs {isActive('bold') ? 'btn-active' : ''}"
					aria-label="Bold"
					title="Bold"
					onclick={() => run((chain) => chain.toggleBold())}><strong>B</strong></button
				>
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs {isActive('italic') ? 'btn-active' : ''}"
					aria-label="Italic"
					title="Italic"
					onclick={() => run((chain) => chain.toggleItalic())}><em>I</em></button
				>
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs {isActive('strike') ? 'btn-active' : ''}"
					aria-label="Strikethrough"
					title="Strikethrough"
					onclick={() => run((chain) => chain.toggleStrike())}><s>S</s></button
				>
			</div>

			<div class="join">
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs {isActive('heading', { level: 2 })
						? 'btn-active'
						: ''}"
					aria-label="Heading"
					title="Heading"
					onclick={() => run((chain) => chain.toggleHeading({ level: 2 }))}>H</button
				>
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs {isActive('bulletList') ? 'btn-active' : ''}"
					aria-label="Bullet list"
					title="Bullet list"
					onclick={() => run((chain) => chain.toggleBulletList())}>• List</button
				>
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs {isActive('blockquote') ? 'btn-active' : ''}"
					aria-label="Quote"
					title="Quote"
					onclick={() => run((chain) => chain.toggleBlockquote())}>“</button
				>
			</div>

			<div class="flex items-center gap-2">
				<label class="btn btn-square btn-ghost btn-xs" title="Text colour">
					<span class="sr-only">Text colour</span>
					<input
						type="color"
						class="size-4 cursor-pointer rounded-full border-0 bg-transparent p-0"
						value={selectedColor || undefined}
						oninput={(event) => setColor(event.currentTarget.value)}
					/>
				</label>
				<select
					class="select w-28 bg-neutral select-xs text-neutral-content"
					value={selectedFontSize}
					onchange={(event) => setFontSize(event.currentTarget.value)}
					aria-label="Text size"
				>
					{#each fontSizes as fontSize}
						<option value={fontSize.value}>{fontSize.label}</option>
					{/each}
				</select>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					aria-label="Clear text styles"
					title="Clear text styles"
					onclick={() =>
						run((chain) => chain.unsetAllMarks().clearNodes().unsetColor().unsetFontSize())}
					>Clear</button
				>
			</div>

			<div class="join max-sm:hidden">
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs"
					disabled={!canUndo()}
					aria-label="Undo"
					title="Undo"
					onclick={() => run((chain) => chain.undo())}>Undo</button
				>
				<button
					type="button"
					class="btn join-item btn-ghost btn-xs"
					disabled={!canRedo()}
					aria-label="Redo"
					title="Redo"
					onclick={() => run((chain) => chain.redo())}>Redo</button
				>
			</div>
		</div>
	{/if}

	<div bind:this={element}></div>
</section>

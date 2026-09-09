import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		// Required for src/instrumentation.server.ts to be bundled. This flag only
		// permits the file; tracing spans stay off behind experimental.tracing.server.
		experimental: { instrumentation: { server: true } }
	}
};

export default config;

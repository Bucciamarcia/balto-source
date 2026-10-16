import { defineEnvVars } from '@sveltejs/kit/env';
import { building } from '$app/env';

export const variables = defineEnvVars({
	TYPESAFE_API_KEY: {
		description: 'API key for TypeSafe AI, used to moderate user-submitted text',
		// optional when building but required when starting the app
		schema: (input) => {
			if (!input && !building) throw new Error('TYPESAFE_API_KEY must be set');
			return input ?? '';
		}
	}
});

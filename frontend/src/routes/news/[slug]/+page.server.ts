import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
};

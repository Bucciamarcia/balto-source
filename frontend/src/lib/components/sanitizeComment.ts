import sanitizeHtml from 'sanitize-html';

export function sanitizeComment(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 's', 'span']),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			img: ['src', 'alt', 'width', 'height'],
			span: ['style']
		}
	});
}

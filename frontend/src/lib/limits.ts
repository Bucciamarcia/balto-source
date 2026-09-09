// Deliberately free of `$app/*` imports: `instrumentation.server.ts` pulls this
// in before the SvelteKit server module is loaded.

/**
 * Largest fanart file we accept, enforced in the browser and in the action.
 *
 * Ceiling is the moderation hop, not the upload. The backend base64-encodes the
 * file into a Claude vision block, and the first-party Claude API caps a single
 * image at 10 MB *base64-encoded*. Base64 inflates bytes by 4/3, so the real raw
 * budget is ~7.5 MB; 5 MB raw encodes to ~6.7 MB and leaves a third of the
 * allowance spare for the JSON envelope around it.
 */
export const MAX_FANART_BYTES = 5 * 1024 * 1024;

/** Single source for the user-facing wording, so the two layers can't drift. */
export const FANART_TOO_LARGE_MESSAGE =
	`This image is too large. Please upload a file under ${MAX_FANART_BYTES / 1024 / 1024} MB.`;

/**
 * Value handed to adapter-node's BODY_SIZE_LIMIT (default: 512K, which is what
 * used to turn large uploads into an opaque 500). Carries an extra megabyte of
 * headroom so multipart boundaries plus the title/description fields can never
 * push a legal-sized image over the transport cap.
 */
export const BODY_SIZE_LIMIT = String(MAX_FANART_BYTES + 1024 * 1024);

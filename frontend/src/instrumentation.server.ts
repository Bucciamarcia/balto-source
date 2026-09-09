import { BODY_SIZE_LIMIT } from '$lib/limits';

// Runs before the adapter's server module is imported, which is the only window
// in which BODY_SIZE_LIMIT can still be read. Keeping it here means the limit
// ships with the repo instead of living in systemd on the box. An explicit
// environment variable still wins.
process.env.BODY_SIZE_LIMIT ??= BODY_SIZE_LIMIT;

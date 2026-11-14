import { dev } from '$app/env';

export const POCKETBASE_INTERNAL_URL = dev ? 'http://127.0.0.1:8090' : 'http://127.0.0.1:7739';

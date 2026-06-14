import { dev } from '$app/environment';

export const POCKETBASE_URL = dev ? "http://127.0.0.1:8090" : "https://backend.baltosource.org";

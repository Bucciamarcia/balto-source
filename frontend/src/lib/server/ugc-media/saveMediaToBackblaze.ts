import { B2Client, BlobSource } from '@backblaze-labs/b2-sdk';
import {
	BACKBLAZE_MEDIA_UGC_ID,
	BACKBLAZE_MEDIA_UGC_APPLICATIONKEY,
	BACKBLAZE_MEDIA_UCG_BUCKET_NAME
} from '$app/env/private';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';

export const ALLOWED_FILETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export async function saveMediaToBackblaze(file: File): Promise<string> {
	if (!ALLOWED_FILETYPES.includes(file.type)) {
		throw new Error('Invalid file type');
	}
	const client = new B2Client({
		applicationKeyId: BACKBLAZE_MEDIA_UGC_ID,
		applicationKey: BACKBLAZE_MEDIA_UGC_APPLICATIONKEY
	});

	await client.authorize();
	const bucket = await client.getBucket(BACKBLAZE_MEDIA_UCG_BUCKET_NAME);
	if (!bucket) throw new Error('Bucket not found');

	const fileName = randomUUID();

	if (file.type !== 'image/avif') {
		const fileBuffer = await file.arrayBuffer();
		const output = await sharp(fileBuffer).avif().toBuffer();
	}
}

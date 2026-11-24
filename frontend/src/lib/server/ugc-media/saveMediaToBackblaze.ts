import { B2Client, BlobSource, Bucket } from '@backblaze-labs/b2-sdk';
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

	try {
		await client.authorize();
	} catch (e) {
		throw new Error(
			`Couldn't authenticate b2: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
	let bucket: Bucket | null;
	try {
		bucket = await client.getBucket(BACKBLAZE_MEDIA_UCG_BUCKET_NAME);
	} catch (e) {
		throw new Error(
			`Couldn't retriev bucket b2: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
	if (!bucket) throw new Error('Bucket not found');

	const fileName = randomUUID();

	const fileBuffer = Buffer.from(await file.arrayBuffer());
	let avifFile: File;
	try {
		const output: Buffer<ArrayBuffer> =
			file.type === 'image/avif'
				? fileBuffer
				: await sharp(fileBuffer).rotate().avif({ quality: 70, effort: 4 }).toBuffer();
		avifFile = new File([output], `${fileName}.avif`, { type: 'image/avif' });
	} catch (e) {
		throw new Error(`Couldn't convert file: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
	try {
		await bucket.upload({
			fileName: avifFile.name,
			source: new BlobSource(avifFile)
		});
	} catch (e) {
		throw new Error(`Couldn't upload file: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
	return avifFile.name;
}

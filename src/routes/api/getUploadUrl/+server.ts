import { S3_ACCESS_KEY, S3_BUCKET_NAME, S3_ENDPOINT, S3_SECRETE_KEY } from '$env/static/private';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json } from '@sveltejs/kit';

const s3Client = new S3Client({
	region: 'auto',
	endpoint: S3_ENDPOINT,
	credentials: {
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRETE_KEY
	},
	forcePathStyle: true
	// signatureVersion: 'v4',
});

export async function POST({ request }) {
	const { key } = await request.json(); // Extract the 'key' parameter from the request body

	const obj = new PutObjectCommand({
		Bucket: S3_BUCKET_NAME,
		Key: key
	});

	const url = await getSignedUrl(s3Client, obj, { expiresIn: 15 * 60 }); // expires in seconds

	return json({ url });
}

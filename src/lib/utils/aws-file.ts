import { S3_ACCESS_KEY, S3_BUCKET_NAME, S3_ENDPOINT, S3_SECRETE_KEY } from '$env/static/private';
import {
	CreateMultipartUploadCommand,
	UploadPartCommand,
	PutObjectCommand,
	GetObjectCommand,
	CompleteMultipartUploadCommand,
	AbortMultipartUploadCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const twentyFiveMB = 25 * 1024 * 1024;

export const createString = (size = twentyFiveMB) => {
	return 'x'.repeat(size);
};

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

export async function getFile(key: string) {
	// const obj = await s3Client.send(
	// 	new GetObjectCommand({
	// 		Bucket: S3_BUCKET_NAME,
	// 		Key: key
	// 	})
	// );

	const obj = new GetObjectCommand({
		Bucket: S3_BUCKET_NAME,
		Key: key
	});

	const url = await getSignedUrl(s3Client, obj, { expiresIn: 15 * 60 }); // expires in seconds

	return url;
}

// export async function deleteFile(key: string) {
// 	try {
// 		await s3Client
// 			.headObject({
// 				Bucket: S3_BUCKET_NAME,
// 				Key: key
// 			})
// 			.promise();

// 		try {
// 			const url = await new Promise((resolve, reject) => {
// 				s3Client.deleteObject(
// 					{
// 						Bucket: S3_BUCKET_NAME,
// 						Key: key
// 					},
// 					(err, res) => {
// 						if (err) {
// 							reject(err);
// 							// console.log({ FileDelErr: err });
// 						} else {
// 							resolve(res);
// 							// console.log({ FileDelSuc: res });
// 						}
// 					}
// 				);
// 			});
// 			return url;
// 		} catch (err) {
// 			console.log(`Deleting S3 subject failed with error: ${err}`);
// 			return `Deleting S3 subject failed with error: ${err}`;
// 		}
// 	} catch (err) {
// 		console.log(`S3 subject not found with error: ${err}`);
// 		return `S3 subject not found with error: ${err}`;
// 	}
// }

export async function uploadFileToS3(fileKey: string, fileData: Buffer) {
	let uploadId;
	const numberOfParts = Math.floor(fileData.length / (5 * 1024 * 1024));

	if (fileData.length < 5 * 1024 * 1024) {
		try {
			return await s3Client.send(
				new PutObjectCommand({
					Bucket: S3_BUCKET_NAME,
					Key: fileKey,
					Body: fileData
				})
			);
		} catch (error) {
			console.log(error);
		}
	} else {
		try {
			const multipartUpload = await s3Client.send(
				new CreateMultipartUploadCommand({
					Bucket: S3_BUCKET_NAME,
					Key: fileKey
				})
			);

			uploadId = multipartUpload.UploadId;

			const uploadPromises = [];
			// Multipart uploads require a minimum size of 5 MB per part.
			const partSize = Math.ceil(fileData.length / numberOfParts);

			// Upload each part.
			for (let i = 0; i < numberOfParts; i++) {
				const start = i * partSize;
				const end = start + partSize;
				uploadPromises.push(
					s3Client
						.send(
							new UploadPartCommand({
								Bucket: S3_BUCKET_NAME,
								Key: fileKey,
								UploadId: uploadId,
								Body: fileData.subarray(start, end),
								PartNumber: i + 1
							})
						)
						.then((d) => {
							return d;
						})
				);
			}

			const uploadResults = await Promise.all(uploadPromises);

			return await s3Client.send(
				new CompleteMultipartUploadCommand({
					Bucket: S3_BUCKET_NAME,
					Key: fileKey,
					UploadId: uploadId,
					MultipartUpload: {
						Parts: uploadResults.map(({ ETag }, i) => ({
							ETag,
							PartNumber: i + 1
						}))
					}
				})
			);

			// Verify the output by downloading the file from the Amazon Simple Storage Service (Amazon S3) console.
			// Because the output is a 25 MB string, text editors might struggle to open the file.
		} catch (err) {
			console.error(err);

			if (uploadId) {
				const abortCommand = new AbortMultipartUploadCommand({
					Bucket: S3_BUCKET_NAME,
					Key: fileKey,
					UploadId: uploadId
				});

				await s3Client.send(abortCommand);
			}
		}
	}
}

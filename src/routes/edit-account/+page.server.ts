import { S3_BUCKET_NAME } from '$env/static/private';
import { getFile, s3 } from '$lib/utils/aws-file.js';
import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import bcrypt from 'bcrypt';

import z from 'zod';

const editUserSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	email: z.string().email(),
	address: z.string(),
	dateOfBirth: z.string(),
	bloodType: z.string(),
	height: z.number()
});
export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;
	let fileUrl;
	if (session?.authUser.Employee.image) {
		fileUrl = await getFile(session?.authUser.Employee.image);
	}

	return { fileUrl };
};

export const actions = {
	profilePicture: async (event) => {
		const data = await event.request.formData();
		const file = data.getAll('profilePicture');
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const allNewFiles = file.map(async (file) => {
			console.log({ file });
			if (!(file instanceof File)) {
				return fail(500, { errorMessage: 'Issue with the file uploaded.' });
			}
			console.log({ file });

			const buffer = await file.arrayBuffer();
			const send = Buffer.from(buffer);
			try {
				await s3
					.putObject({
						Bucket: S3_BUCKET_NAME,
						Key: `profilePicture/${session?.authUser.Employee.id}`,
						Body: send
					})
					.promise();

				const newFile = await prisma.employee.update({
					where: {
						id: session?.authUser.Employee.id
					},
					data: {
						image: `profilePicture/${session?.authUser.Employee.id}`
					}
				});

				console.log({ newFile });
			} catch (error) {
				console.log(error as Error);
			}
		});
	},
	editPassword: async (event) => {
		const data = await event.request.formData();
		const oldPassword = data.get('oldPassword');
		const newPassword = data.get('newPassword');

		const session = (await event.locals.getSession()) as EnhancedSessionType | null;
		const user = await prisma.user.findFirst({
			where: {
				id: session?.authUser.id
			}
		});
		if (!oldPassword || typeof oldPassword !== 'string') {
			return fail(500, { errorMessage: 'New password not found.' });
		}
		if (!newPassword || typeof newPassword !== 'string') {
			return fail(500, { errorMessage: 'New password not found.' });
		}

		const authorized = await bcrypt.compare(oldPassword, user?.jwtPassword || '');
		if (!authorized) {
			return fail(500, { errorMessage: 'Wrong Password' });
		}

		const newPasswordHash = await bcrypt.hash(newPassword, 10);
		const passwordChanged = await prisma.user.update({
			where: {
				id: session?.authUser.id
			},
			data: {
				jwtPassword: newPasswordHash
			}
		});
		return { passwordChanged };
	}
};

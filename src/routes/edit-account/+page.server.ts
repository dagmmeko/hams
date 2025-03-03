import { uploadFileToS3, getFile } from '$lib/utils/aws-file.js';
import { prisma } from '$lib/utils/prisma.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import bcrypt from 'bcrypt';

import z from 'zod';

const editUserSchema = z.object({
	userName: z.string(),
	phoneNumber: z.string(),
	address: z.string().optional(),
	dateOfBirth: z.string().optional(),
	bloodType: z.string().optional(),
	height: z.number().optional()
});
export const load = async (event) => {
	const session = (await event.locals.getSession()) as EnhancedSessionType | null;
	let fileUrl;
	if (session?.authUser.Employee.image) {
		fileUrl = await getFile(session?.authUser.Employee.image);
	}

	const user = await prisma.user.findFirst({
		where: {
			id: session?.authUser.id
		},
		include: {
			Employee: true
		}
	});

	const editUserForm = await superValidate(
		{
			userName: user?.userName ?? '',
			phoneNumber: user?.phoneNumber ?? '',
			address: user?.Employee?.address ?? '',
			dateOfBirth: user?.Employee?.dateOfBirth ? user?.Employee?.dateOfBirth.toISOString() : '',
			bloodType: user?.Employee?.bloodType ?? '',
			height: user?.Employee?.height ?? 0
		},
		editUserSchema
	);

	return { fileUrl, editUserForm };
};

export const actions = {
	profilePicture: async (event) => {
		const data = await event.request.formData();
		const file = data.getAll('profilePicture');
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		const allNewFiles = await Promise.all(
			file.map(async (file) => {
				if (!(file instanceof File)) {
					return fail(500, { errorMessage: 'Issue with the file uploaded.' });
				}

				const buffer = await file.arrayBuffer();
				const send = Buffer.from(buffer);

				const fileUpload = await uploadFileToS3(
					`profilePicture/${session?.authUser.Employee.id}/${file.name}`,
					send
				);

				if (fileUpload) {
					const newFile = await prisma.employee.update({
						where: {
							id: session?.authUser.Employee.id
						},
						data: {
							image: `profilePicture/${session?.authUser.Employee.id}/${file.name}`
						}
					});
					return newFile;
				}
			})
		);

		return { allNewFiles };
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
	},
	editUser: async (event) => {
		const editUserForm = await superValidate(event.request, editUserSchema);
		const session = (await event.locals.getSession()) as EnhancedSessionType | null;

		if (!editUserForm) {
			return fail(400, { editUserForm });
		}
		const editUser = await prisma.user.update({
			where: {
				id: session?.authUser.id
			},
			data: {
				userName: editUserForm.data.userName,
				phoneNumber: editUserForm.data.phoneNumber,
				Employee: {
					update: {
						address: editUserForm.data.address,
						dateOfBirth: editUserForm.data.dateOfBirth,
						bloodType: editUserForm.data.bloodType,
						height: editUserForm.data.height
					}
				}
			}
		});

		return { editUserForm, editUser };
	}
};

import { SvelteKitAuth } from '@auth/sveltekit';
import CredentialsProvider from '@auth/core/providers/credentials';
import { prisma } from '$lib/utils/prisma';
import bcrypt from 'bcrypt';
import { AUTH_SECRET } from '$env/static/private';

export const authHook = SvelteKitAuth({
	providers: [
		CredentialsProvider({
			name: 'Sign in with Email',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'text' }
			},
			async authorize(credentials) {
				if (!credentials.email) {
					throw new Error('Email not found');
				}
				if (!credentials.password || typeof credentials.password !== 'string') {
					throw new Error('Password not found');
				}
				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email
					}
				});

				if (!user) {
					throw new Error('User not found!');
				}
				if (!user.jwtPassword) {
					throw new Error('User password not set.');
				}

				const authorized = await bcrypt.compare(credentials.password, user.jwtPassword);
				if (!authorized) {
					throw new Error('User not Authorized');
				}
				return {
					id: user.id.toString(),
					name: user.userName,
					email: user.email
				};
			}
		})
	],
	pages: {
		error: '/auth/signup-error'
	},
	secret: AUTH_SECRET,
	callbacks: {
		signIn: async (params) => {
			if (params.account?.provider === 'credentials') {
				return true;
			}
			throw new Error('Account provider not known.');
		},
		jwt: async (params) => {
			if (!params.token?.email) {
				throw new Error('JWT email not found.');
			}

			const authUser = await prisma.user.findFirst({
				where: {
					email: params.token.email
				},
				select: {
					email: true,
					Employee: true,
					phoneNumber: true,
					userName: true,
					id: true
				}
			});
			return { ...params.token, authUser };
		},
		session: async (params) => {
			return {
				...params.session,
				authUser: params.token.authUser
			};
		}
	}
});

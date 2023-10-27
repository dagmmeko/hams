import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
const prisma = new PrismaClient();

const encryptedPassword = await bcrypt.hash('Pass1234', 10);
async function main() {
	const data = await prisma.user.create({
		data: {
			email: 'yafet@classicpackagingplc.com',
			phoneNumber: '251911480872',
			userName: 'Yafet Kebede',
			jwtPassword: encryptedPassword,
			Employee: {
				create: {
					hiredDate: new Date(),
					isSuspended: false,
					address: 'Addis Ababa',
					staffIdNumber: 'HAMS/2',
					roleId: 1
				}
			}
		}
	});
	const data2 = await prisma.user.create({
		data: {
			email: 'afeworkeueal@gmail.com',
			phoneNumber: '251911480874',
			userName: 'Eyuel Afework',
			jwtPassword: encryptedPassword,
			Employee: {
				create: {
					hiredDate: new Date(),
					isSuspended: false,
					address: 'Addis Ababa',
					staffIdNumber: 'HAMS/2',
					roleId: 1
				}
			}
		}
	});
	console.log({ data });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

import { ItemsCategory, PrismaClient, PropertyStatus } from '@prisma/client';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { unitProperty } from './property-data';
const prisma = new PrismaClient();

// const unitIds = [15, 16, 17, 18, 19, 20, 21, 22, 23];

const unitIds = [111, 112, 211, 222, 223, 224];

const encryptedPassword = await bcrypt.hash('Pass1234', 10);
async function main() {
	// const data = await prisma.user.create({
	// 	data: {
	// 		email: 'dagixmeko@gmail.com',
	// 		phoneNumber: '251911480875',
	// 		userName: 'Dagem Mekonnen',
	// 		jwtPassword: encryptedPassword,
	// 		Employee: {
	// 			create: {
	// 				hiredDate: new Date(),
	// 				isSuspended: false,
	// 				address: 'Addis Ababa',
	// 				staffIdNumber: 'HAMS/1/1',
	// 				roleId: 1
	// 			}
	// 		}
	// 	}
	// });
	// const data1 = await prisma.user.create({
	// 	data: {
	// 		email: 'yafet@classicpackagingplc.com',
	// 		phoneNumber: '251911480872',
	// 		userName: 'Yafet Kebede',
	// 		jwtPassword: encryptedPassword,
	// 		Employee: {
	// 			create: {
	// 				hiredDate: new Date(),
	// 				isSuspended: false,
	// 				address: 'Addis Ababa',
	// 				staffIdNumber: 'HAMS/1/2',
	// 				roleId: 1
	// 			}
	// 		}
	// 	}
	// });
	// const data2 = await prisma.user.create({
	// 	data: {
	// 		email: 'afeworkeueal@gmail.com',
	// 		phoneNumber: '251911480874',
	// 		userName: 'Eyuel Afework',
	// 		jwtPassword: encryptedPassword,
	// 		Employee: {
	// 			create: {
	// 				hiredDate: new Date(),
	// 				isSuspended: false,
	// 				address: 'Addis Ababa',
	// 				staffIdNumber: 'HAMS/1/3',
	// 				roleId: 1
	// 			}
	// 		}
	// 	}
	// });

	// const coffeecology = await prisma.tenants.create({
	// 	data: {
	// 		fullName: 'Nahom Liyew Semanew',
	// 		companyName: 'Coffeecology',
	// 		phoneNumber: '0911236353',
	// 		TenantRental: {
	// 			create: {
	// 				unitId: 30,
	// 				contractStartDate: new Date('9/19/23'),
	// 				contractEndDate: new Date('1/22/28'),
	// 				active: true
	// 			}
	// 		},
	// 		Receipts: {
	// 			create: {
	// 				startDate: new Date('9/19/23'),
	// 				endDate: new Date('4/16/24'),
	// 				receiptReceived: true,
	// 				receiptReceivedOn: new Date('10/20/23'),
	// 				paymentConfirmed: true,
	// 				amount: 1144200,
	// 				bankName: '',
	// 				paymentReason: 'Rent',
	// 				receiptReferenceNumber: '1',
	// 				payToUnitId: 30
	// 			}
	// 		}
	// 	}
	// });

	// const fnboutique = await prisma.tenants.create({
	// 	data: {
	// 		fullName: 'Yohannes Membere Wolde',
	// 		companyName: 'FN Boutique',
	// 		phoneNumber: '0911466011',
	// 		emergencyContactName: 'Dagmawi Girma',
	// 		emergencyContactPhoneNumber: '0911214933',
	// 		emergencyContactEmail: 'dagmawi@omnalogistics.com',
	// 		TenantRental: {
	// 			create: {
	// 				unitId: 27,
	// 				contractStartDate: new Date('9/19/23'),
	// 				contractEndDate: new Date('9/18/24'),
	// 				active: true
	// 			}
	// 		},
	// 		Receipts: {
	// 			create: {
	// 				startDate: new Date('9/19/23'),
	// 				endDate: new Date('12/18/23'),
	// 				receiptReceived: true,
	// 				receiptReceivedOn: new Date('10/20/23'),
	// 				paymentConfirmed: true,
	// 				amount: 296420.99,
	// 				bankName: 'CBE',
	// 				paymentReason: 'Rent',
	// 				receiptReferenceNumber: '2',
	// 				payToUnitId: 27
	// 			}
	// 		}
	// 	}
	// });

	// const divineHair = await prisma.tenants.create({
	// 	data: {
	// 		fullName: 'Membere Abera',
	// 		companyName: 'Divine Hair and Nail Salon',
	// 		phoneNumber: '0911221686'
	// 	}
	// });
	// const Intnom

	unitIds.map(async (id) => {
		await prisma.rentalUnits.update({
			where: {
				id: id
			},
			data: {
				Property: {
					createMany: {
						data: [
							...unitProperty.map((unit) => {
								return {
									name: unit.name,
									description: unit.description,
									numberofUnits: unit.numberofUnits,
									propertyStatus: unit.propertyStatus as PropertyStatus,
									available: unit.available,
									itemCategory: unit.itemCategory as ItemsCategory
								};
							})
						]
					}
				}
			}
		});
	});
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

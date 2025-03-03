import { ItemsCategory, PrismaClient, PropertyStatus } from '@prisma/client'
import { unitProperty } from './data-301a'
const prisma = new PrismaClient()

const unitIds = [17, 22]

// const unitIds = [111, 112, 211, 222, 223, 224];

async function main() {
	unitIds.map(async (id) => {
		await prisma.rentalUnits.update({
			where: {
				id: id,
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
									itemCategory: unit.itemCategory as ItemsCategory,
									itemsPrice: unit.itemsPrice,
								}
							}),
						],
					},
				},
			},
		})
	})
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})

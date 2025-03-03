import { prisma } from '$lib/utils/prisma'
import { json } from '@sveltejs/kit'

export async function GET() {
	const pentHouse = await prisma.rentalUnits.findFirst({
		where: {
			id: 23,
		},
	})
	const room = await prisma.rentalUnits.findFirst({
		where: {
			id: 15,
		},
	})
	return json({
		pentHousePrice: pentHouse?.price,
		pentHouseCurrency: pentHouse?.currency,
		pentHouseUtilityPrice: pentHouse?.utilityPrice,
		roomPrice: room?.price,
		roomUtilityPrice: room?.utilityPrice,
		roomCurrency: room?.currency,
	})
}

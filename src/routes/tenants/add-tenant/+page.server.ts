import z from 'zod';

const addTenantSchema = z.object({
	fullName: z.string(),
	phoneNumber: z.string(),
	purposeOfRent: z.string(),
	contractStartDate: z.date(),
	contractEndDate: z.date(),
	durationOfStayInCountry: z.date(),
	email: z.string().email(),
	emergencyContactName: z.string(),
	emergencyContactPhoneNumber: z.string(),
	emergencyContactEmail: z.string().email(),
	tenantScore: z.number()
});

import { p as prisma } from "../../../../chunks/prisma.js";
import { f as fail } from "../../../../chunks/index.js";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import z from "zod";
import { s as s3 } from "../../../../chunks/aws-file.js";
import { S as S3_BUCKET_NAME } from "../../../../chunks/private.js";
const addTenantSchema = z.object({
  fullName: z.string(),
  phoneNumber: z.string(),
  purposeOfRent: z.string(),
  contractStartDate: z.date(),
  contractEndDate: z.date(),
  durationOfStayInCountry: z.number(),
  email: z.string().email(),
  emergencyContactName: z.string(),
  emergencyContactPhoneNumber: z.string(),
  emergencyContactEmail: z.string().email(),
  tenantScore: z.number(),
  rentalUnitsId: z.number(),
  newPrice: z.number().optional(),
  priceChange: z.boolean().optional()
});
const load = async (event) => {
  const addTenantForm = await superValidate(addTenantSchema);
  const rentalUnits = await prisma.rentalUnits.findMany({
    where: {
      deletedAt: null,
      active: false
    }
  });
  return { addTenantForm, rentalUnits };
};
const actions = {
  addTenant: async (event) => {
    const data = await event.request.clone().formData();
    const tenantFile = data.getAll("tenantFile");
    tenantFile.map(async (file) => {
      if (!(file instanceof File)) {
        return fail(500, { errorMessage: "Issue with the file uploaded." });
      }
    });
    const addTenantForm = await superValidate(event.request.clone(), addTenantSchema);
    if (!addTenantForm) {
      return fail(400, { addTenantForm });
    }
    try {
      const addTenant = await prisma.tenants.create({
        data: {
          fullName: addTenantForm.data.fullName,
          phoneNumber: addTenantForm.data.phoneNumber,
          email: addTenantForm.data.email,
          emergencyContactName: addTenantForm.data.emergencyContactName,
          emergencyContactPhoneNumber: addTenantForm.data.emergencyContactPhoneNumber,
          emergencyContactEmail: addTenantForm.data.emergencyContactEmail,
          tenantScore: addTenantForm.data.tenantScore,
          ...addTenantForm.data.priceChange && addTenantForm.data.newPrice && {
            PriceChange: {
              create: {
                price: addTenantForm.data.newPrice,
                unitId: addTenantForm.data.rentalUnitsId
              }
            }
          },
          ...!addTenantForm.data.priceChange && {
            TenantRental: {
              create: {
                unitId: addTenantForm.data.rentalUnitsId,
                purposeOfRent: addTenantForm.data.purposeOfRent,
                contractStartDate: addTenantForm.data.contractStartDate,
                contractEndDate: addTenantForm.data.contractEndDate,
                durationOfStayInCountry: addTenantForm.data.durationOfStayInCountry
              }
            }
          }
        }
      });
      if (!addTenant)
        return fail(500, { addTenantForm, errorMessage: "Tenant not created." });
      if (!addTenantForm.data.priceChange) {
        await prisma.rentalUnits.update({
          where: {
            id: addTenantForm.data.rentalUnitsId
          },
          data: {
            active: true
          }
        });
      }
      tenantFile.map(async (file) => {
        if (!(file instanceof File)) {
          return fail(500, { errorMessage: "Issue with the file uploaded." });
        }
        console.log({ file });
        const buffer = await file.arrayBuffer();
        const send = Buffer.from(buffer);
        try {
          await s3.putObject({
            Bucket: S3_BUCKET_NAME,
            Key: `tenantsFile/${addTenant.id}/${file.name}`,
            Body: send
          }).promise();
          await prisma.file.create({
            data: {
              key: `tenantsFile/${addTenant.id}/${file.name}`,
              fileName: file.name,
              TenantsFile: {
                create: {
                  tenantsId: Number(addTenant.id)
                }
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      });
      return { addTenantForm, addTenant };
    } catch (error) {
      return fail(500, { addTenantForm, errorMessage: "Tenant not created." });
    }
  }
};
export {
  actions,
  load
};

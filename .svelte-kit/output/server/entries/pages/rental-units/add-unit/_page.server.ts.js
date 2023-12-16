import { p as prisma } from "../../../../chunks/prisma.js";
import { f as fail } from "../../../../chunks/index.js";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import z from "zod";
import { s as s3 } from "../../../../chunks/aws-file.js";
import { S as S3_BUCKET_NAME } from "../../../../chunks/private.js";
const addUnitSchema = z.object({
  roomNumber: z.string(),
  floor: z.string(),
  size: z.number(),
  price: z.number(),
  unitType: z.enum(["COMMERCIAL", "RESIDENTIAL"]),
  condition: z.enum(["NEEDS_REPAIR", "OUT_OF_SERVICE", "GOOD_CONDITION"]),
  minimumRentalDate: z.number().int(),
  maximumTenants: z.number().int()
});
const load = async (event) => {
  const addUnitForm = await superValidate(addUnitSchema);
  return { addUnitForm };
};
const actions = {
  addUnit: async (event) => {
    const addUnitForm = await superValidate(event.request.clone(), addUnitSchema);
    const data = await event.request.clone().formData();
    const unitFile = data.getAll("unitFile");
    unitFile.map(async (file) => {
      if (!(file instanceof File)) {
        return fail(500, { errorMessage: "Issue with the file uploaded." });
      }
    });
    if (!addUnitForm) {
      return fail(400, { addUnitForm });
    }
    try {
      const addUnit = await prisma.rentalUnits.create({
        data: {
          roomNumber: addUnitForm.data.roomNumber,
          floor: addUnitForm.data.floor,
          kareMeter: addUnitForm.data.size,
          price: addUnitForm.data.price,
          unitType: addUnitForm.data.unitType,
          maximumTenants: addUnitForm.data.maximumTenants,
          minimumRentalDate: addUnitForm.data.minimumRentalDate,
          Inspection: {
            create: {
              InspectionStatus: addUnitForm.data.condition,
              description: "First Inspection",
              inspectionDate: /* @__PURE__ */ new Date()
            }
          }
        }
      });
      if (!addUnit)
        return fail(500, { errorMessage: "Unit not created." });
      unitFile.map(async (file) => {
        if (!(file instanceof File)) {
          return fail(500, { errorMessage: "Issue with the file uploaded." });
        }
        const buffer = await file.arrayBuffer();
        const send = Buffer.from(buffer);
        try {
          await s3.putObject({
            Bucket: S3_BUCKET_NAME,
            Key: `unitFile/${addUnit.id}/${file.name}`,
            Body: send
          }).promise();
          await prisma.file.create({
            data: {
              key: `unitFile/${addUnit.id}/${file.name}`,
              fileName: file.name,
              UnitsFile: {
                create: {
                  rentalUnitId: Number(addUnit.id)
                }
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      });
      return { addUnitForm, addUnit };
    } catch (error) {
      return fail(500, {
        addUnitForm,
        errorMessage: error?.message ?? "Unknown error"
      });
    }
  }
};
export {
  actions,
  load
};

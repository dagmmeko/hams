import { p as prisma } from "../../../../chunks/prisma.js";
import { e as error, f as fail } from "../../../../chunks/index.js";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import z from "zod";
const editVendorSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  ServiceType: z.enum(["CLEANING", "ELECTRICITY", "PLUMBING", "PAINTING", "SECURITY"]),
  //
  CreatedAt: z.date(),
  // contract start date???
  score: z.string()
});
const addPaymentSchema = z.object({
  amount: z.number(),
  despositedToBank: z.string(),
  paidOn: z.date()
  //needs to have account Number
});
const load = async (event) => {
  if (!event.params.vendorId) {
    throw error(404, "Vendor ID not found");
  }
  const vendor = await prisma.vendor.findFirst({
    where: {
      id: Number(event.params.vendorId)
    }
  });
  if (!vendor) {
    throw error(404, "Vendor not found");
  }
  const payments = await prisma.payment.findMany({
    where: {
      id: Number(event.params.vendorId),
      deletedAt: null
    },
    include: {
      VendorTask: true
    }
  });
  const editVendorForm = await superValidate(
    {
      name: vendor.name || "",
      phoneNumber: vendor.phoneNumber || "",
      email: vendor.email || "",
      ServiceType: vendor.serviceType,
      CreatedAt: vendor.createdAt || "",
      // contract start date???
      score: vendor.score || ""
    },
    editVendorSchema
  );
  return { editVendorForm, payments };
};
const actions = {
  editVendorInfo: async (event) => {
    const editVendorForm = await superValidate(event.request, editVendorSchema);
    if (!editVendorForm) {
      return fail(400, { editVendorForm });
    }
    console.log({ editVendorForm });
    await prisma.vendor.update({
      where: {
        id: parseInt(event.params.vendorId)
      },
      data: {
        name: editVendorForm.data.name,
        phoneNumber: editVendorForm.data.phoneNumber,
        email: editVendorForm.data.email,
        serviceType: editVendorForm.data.ServiceType,
        score: editVendorForm.data.score
      }
    });
  },
  addVendor: async (event) => {
    const addPaymentForm = await superValidate(event.request, addPaymentSchema);
    if (!addPaymentForm) {
      return fail(400, { addPaymentForm });
    }
    await prisma.payment.create(
      {
        data: {
          amount: addPaymentForm.data.amount,
          despositedToBank: addPaymentForm.data.despositedToBank,
          paidOn: addPaymentForm.data.paidOn
        }
      }
    );
  }
};
export {
  actions,
  load
};

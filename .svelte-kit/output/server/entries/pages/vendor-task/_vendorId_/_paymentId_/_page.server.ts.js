import { p as prisma } from "../../../../../chunks/prisma.js";
import { e as error, f as fail } from "../../../../../chunks/index.js";
import { s as superValidate } from "../../../../../chunks/superValidate.js";
import z from "zod";
const editPaymentSchema = z.object({
  id: z.number().int(),
  amount: z.number(),
  despositedToBank: z.string(),
  paidOn: z.date()
});
const load = async (event) => {
  const payment = await prisma.payment.findFirst(
    {
      where: {
        id: parseInt(event.params.vendorId)
      },
      include: {
        VendorTask: true
      }
    }
  );
  if (!payment) {
    throw error(404, "payment not found");
  }
  const editPaymentForm = await superValidate(
    {
      id: payment?.id || 0,
      amount: payment?.amount || 0,
      despositedToBank: payment?.despositedToBank || "",
      paidOn: payment?.paidOn || /* @__PURE__ */ new Date()
    },
    editPaymentSchema
  );
  return { editPaymentForm };
};
const actions = {
  editPaymentInfo: async (event) => {
    const editPaymentForm = await superValidate(event.request, editPaymentSchema);
    if (!editPaymentForm) {
      return fail(400, { editPaymentForm });
    }
    await prisma.payment.update({
      where: {
        id: parseInt(event.params.paymentId)
      },
      data: {
        amount: editPaymentForm.data.amount,
        despositedToBank: editPaymentForm.data.despositedToBank,
        paidOn: editPaymentForm.data.paidOn
      }
    });
  }
};
export {
  actions,
  load
};

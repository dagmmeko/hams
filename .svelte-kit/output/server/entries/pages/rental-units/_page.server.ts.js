import { p as prisma } from "../../../chunks/prisma.js";
import { s as superValidate } from "../../../chunks/superValidate.js";
import z from "zod";
const deleteUnitSchema = z.object({
  deleteUnitId: z.number().int()
});
const load = async (event) => {
  const deleteUnitForm = await superValidate(deleteUnitSchema);
  const search = event.url.searchParams.get("search");
  const units = await prisma.rentalUnits.findMany({
    where: {
      ...search && {
        roomNumber: {
          contains: search
        }
      },
      deletedAt: null
    },
    include: {
      Inspection: {
        orderBy: {
          inspectionDate: "desc"
        },
        take: 1
      },
      TenantRental: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1,
        include: {
          Tenants: true
        }
      }
    }
  });
  return { deleteUnitForm, units };
};
const actions = {
  archiveUnit: async (event) => {
    const deleteUnitForm = await superValidate(event.request, deleteUnitSchema);
    const deleteUnit = await prisma.rentalUnits.update({
      where: {
        id: Number(deleteUnitForm.data.deleteUnitId)
      },
      data: {
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return { deleteUnitForm, deleteUnit };
  }
};
export {
  actions,
  load
};

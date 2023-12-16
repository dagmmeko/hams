import { p as prisma } from "../../../chunks/prisma.js";
import "../../../chunks/index.js";
import { s as superValidate } from "../../../chunks/superValidate.js";
import z from "zod";
const deleteRoleSchema = z.object({
  deleteRoleId: z.number().int()
});
const load = async (event) => {
  const deleteRoleForm = await superValidate(deleteRoleSchema);
  const search = event.url.searchParams.get("search");
  const roles = await prisma.role.findMany({
    where: {
      ...search && {
        name: {
          contains: search
        }
      },
      deletedAt: null
    },
    include: {
      Employees: true
    }
  });
  return { deleteRoleForm, roles };
};
const actions = {
  archiveRole: async (event) => {
    const deleteRoleForm = await superValidate(event.request, deleteRoleSchema);
    const deleteRole = await prisma.role.update({
      where: {
        id: Number(deleteRoleForm.data.deleteRoleId)
      },
      data: {
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return { deleteRoleForm, deleteRole };
  }
};
export {
  actions,
  load
};

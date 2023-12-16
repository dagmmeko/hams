import z from "zod";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import { f as fail } from "../../../../chunks/index.js";
import { p as prisma } from "../../../../chunks/prisma.js";
const addRoleSchema = z.object({
  name: z.string(),
  description: z.string(),
  scopes: z.string().array()
});
const load = async (event) => {
  const addRoleForm = await superValidate(addRoleSchema);
  return { addRoleForm };
};
const actions = {
  addRole: async (event) => {
    const addRoleForm = await superValidate(event.request, addRoleSchema);
    if (!addRoleForm) {
      return fail(400, { addRoleForm });
    }
    const addRole = await prisma.role.create({
      data: {
        name: addRoleForm.data.name,
        description: addRoleForm.data.description,
        Scopes: {
          createMany: {
            data: [
              ...addRoleForm.data.scopes.map((scope) => {
                return {
                  name: scope
                };
              })
            ]
          }
        }
      }
    });
    return { addRoleForm, addRole };
  }
};
export {
  actions,
  load
};

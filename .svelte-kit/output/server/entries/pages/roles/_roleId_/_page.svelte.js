import { c as create_ssr_component, b as subscribe, e as escape, h as spread, j as escape_object, a as add_attribute, f as each } from "../../../../chunks/ssr.js";
import { a as allScopes } from "../../../../chunks/scopes.js";
import { s as superForm, g as goto } from "../../../../chunks/index3.js";
import { t as toast } from "../../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $constraints, $$unsubscribe_constraints;
  let $editRoleForm, $$unsubscribe_editRoleForm;
  let { data } = $$props;
  let { form } = $$props;
  const { form: editRoleForm, enhance: editFormEnhance, constraints } = superForm(data.editRoleForm);
  $$unsubscribe_editRoleForm = subscribe(editRoleForm, (value) => $editRoleForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  superForm(data.deleteRoleForm, {
    onSubmit: ({ formData, cancel }) => {
      if (!window.confirm("Are you sure you want to delete this role?")) {
        cancel();
      }
      formData.set("deleteRoleId", data.role.id.toString());
    }
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  {
    form?.deleteRoleForm ? toast.push("Role deleted successfully") : null;
  }
  {
    form?.deleteRoleForm ? goto("/roles") : null;
  }
  {
    form?.editRoleForm ? toast.push("Role edited successfully") : null;
  }
  $$unsubscribe_constraints();
  $$unsubscribe_editRoleForm();
  return `<form method="post" action="?/editRole"><div class="grid grid-flow-col mx-10 my-12 items-start space-x-12 bg-white rounded-xl p-8"><div class="flex-1 grid col-span-1 gap-4 justify-items-stretch it"><div><p class="text-xl font-semibold"><span class="font-bold text-primary">${escape(data.role.name)}</span> Role</p> <p class="text-sm text-subtitle pt-2" data-svelte-h="svelte-1wa79vg">Edit role here. Click save when you&#39;re done.</p></div> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1fu522k">Role</span> <input${spread(
    [
      { required: true },
      {
        class: "w-full border-[1px] border-black/60 rounded-md p-2"
      },
      { name: "name" },
      escape_object($constraints.name)
    ],
    {}
  )}${add_attribute("value", $editRoleForm.name, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1qymmvq">Description</span> <textarea${spread(
    [
      {
        class: "w-full border-[1px] border-black/60 rounded-md p-2"
      },
      { name: "description" },
      escape_object($constraints.description)
    ],
    {}
  )}>${escape($editRoleForm.description || "")}</textarea></label> <div class="flex gap-3"><button type="submit" ${"disabled"} class="disabled:bg-primary/60 bg-primary text-white rounded-md py-2 w-full">Edit Role</button> ${data.role.Employees.length ? `<button type="submit" class="bg-subtitle text-white rounded-md py-2 w-full" data-svelte-h="svelte-ip0zcq">Archive Role</button>` : `<form method="post" action="?/archiveRole" class="w-full bg-danger text-white flex justify-center rounded-md py-2"><button type="submit" class="w-full h-full" data-svelte-h="svelte-134r6sf">Archive Role</button></form>`}</div></div> <div class="flex-1 col-span-2"><div class="grid grid-cols-3 gap-3">${each(allScopes, (scope) => {
    return `<label class="flex space-x-2"><input type="checkbox"${add_attribute("value", scope, 0)} name="scopes"${~$editRoleForm.scopes.indexOf(scope) ? add_attribute("checked", true, 1) : ""}> <div class="text-xs flex-1">${escape(scope.replace(/_/g, " ").replace(/^(.)(.*)$/, (_, firstLetter, restOfString) => firstLetter.toUpperCase() + restOfString.toLowerCase()))}</div> </label>`;
  })}</div></div></div></form>`;
});
export {
  Page as default
};

import { c as create_ssr_component, b as subscribe, h as spread, j as escape_object, a as add_attribute, e as escape, f as each } from "../../../../chunks/ssr.js";
import { s as superForm, g as goto } from "../../../../chunks/index3.js";
import { a as allScopes } from "../../../../chunks/scopes.js";
import { t as toast } from "../../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $constraints, $$unsubscribe_constraints;
  let $addRoleForm, $$unsubscribe_addRoleForm;
  let { data } = $$props;
  let { form } = $$props;
  const { form: addRoleForm, enhance: addFormEnhance, constraints } = superForm(data.addRoleForm);
  $$unsubscribe_addRoleForm = subscribe(addRoleForm, (value) => $addRoleForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  {
    form?.addRole ? goto("/roles") : null;
  }
  {
    form?.addRole ? toast.push("Role created successfully") : null;
  }
  $$unsubscribe_constraints();
  $$unsubscribe_addRoleForm();
  return `<form method="post" action="?/addRole"><div class="grid grid-flow-col mx-10 my-12 items-start space-x-12 bg-white rounded-xl p-8"><div class="flex-1 grid col-span-1 gap-4 justify-items-stretch it"><div data-svelte-h="svelte-1ijdua7"><p class="text-xl font-semibold">New Role</p> <p class="text-sm text-subtitle pt-2">Register new role here. Click save when you&#39;re done.</p></div> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1fu522k">Role</span> <input${spread(
    [
      { required: true },
      {
        class: "w-full border-[1px] border-black/60 rounded-md p-2"
      },
      { name: "name" },
      escape_object($constraints.name)
    ],
    {}
  )}${add_attribute("value", $addRoleForm.name, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1qymmvq">Description</span> <textarea${spread(
    [
      {
        class: "w-full border-[1px] border-black/60 rounded-md p-2"
      },
      { name: "description" },
      escape_object($constraints.description)
    ],
    {}
  )}>${escape($addRoleForm.description || "")}</textarea></label> <button type="submit" class="bg-primary text-white rounded-md py-2" data-svelte-h="svelte-tacgzg">Create Role</button></div> <div class="flex-1 col-span-2"><div class="grid grid-cols-3 gap-3">${each(allScopes, (scope) => {
    return `<label class="flex space-x-2"><input type="checkbox"${add_attribute("value", scope, 0)} name="scopes"${~$addRoleForm.scopes.indexOf(scope) ? add_attribute("checked", true, 1) : ""}> <div class="text-xs flex-1">${escape(scope.replace(/_/g, " ").replace(/^(.)(.*)$/, (_, firstLetter, restOfString) => firstLetter.toUpperCase() + restOfString.toLowerCase()))}</div> </label>`;
  })}</div></div></div></form>`;
});
export {
  Page as default
};

import { c as create_ssr_component, b as subscribe, h as spread, j as escape_object, a as add_attribute, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { s as superForm } from "../../../../chunks/index3.js";
import { D as Delete_svg } from "../../../../chunks/delete.svg.js";
import "dayjs";
/* empty css                                                            */import "../../../../chunks/index.js";
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $constraints, $$unsubscribe_constraints;
  let $editVendorForm, $$unsubscribe_editVendorForm;
  let { data } = $$props;
  const { form: editVendorForm, enhance: editFormEnhance, constraints } = superForm(data.editVendorForm);
  $$unsubscribe_editVendorForm = subscribe(editVendorForm, (value) => $editVendorForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_constraints();
  $$unsubscribe_editVendorForm();
  return `<div class="p-6"><form method="post" action="?/editEmployeeInfo"><div class="flex justify-between"><div class="grid" data-svelte-h="svelte-1kucxaf"><p class="text-2xl">Vendor Info</p> <p class="text-sm py-1 rounded-xl">Vendor details here.</p></div> <button class="bg-primary text-white rounded-md py-2 px-6" data-svelte-h="svelte-jna4gr">Update Info</button></div> <hr class="my-6"> <div class="grid gap-6 grid-cols-4"><label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1w7ycdi">Vendor Name</span> <input${spread([{ name: "userName" }, escape_object($constraints.name)], {})}${add_attribute("value", $editVendorForm.name, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-13axhj0">Contact number</span> <input${spread([{ name: "phoneNumber" }, escape_object($constraints.phoneNumber)], {})}${add_attribute("value", $editVendorForm.phoneNumber, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-t0fb9x">Status</span> <input name="status"${add_attribute("value", $editVendorForm.name, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1j23drc">Service Type</span> <select${spread([{ name: "employmentType" }, escape_object($constraints.ServiceType)], {})}><option selected disabled value="Select Employment Type" data-svelte-h="svelte-h4blhj">Select Employment Type</option><option value="CLEANING" data-svelte-h="svelte-1ojce03">Full Time</option><option value="ELECTRICITY" data-svelte-h="svelte-atlo3d">Part Time</option><option value="PLUMBING" data-svelte-h="svelte-1lhgjws">Contract</option><option value="PAINTING" data-svelte-h="svelte-1b5b2uc">Contract</option><option value="SECURITY" data-svelte-h="svelte-jo2oda">Contract</option></select></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1urgksf">Email</span> <input${spread([{ name: "email" }, escape_object($constraints.email)], {})}${add_attribute("value", $editVendorForm.email, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-gokofd">Score</span> <input name="height"${add_attribute("value", $editVendorForm.score, 0)}></label> <label class="grid flex-1" data-svelte-h="svelte-cwkb2l"><span class="text-primary font-semibold py-1">Created At</span> </label> <br> <label class="grid flex-1" data-svelte-h="svelte-5o97kd"><span class="text-primary font-semibold py-1">Contract Files</span> <input type="file" name="" alt="contract files"></label></div></form> <p class="text-2xl mt-10" data-svelte-h="svelte-3o2v2v">Danger</p> <hr class="my-6"> <div class="border-2 border-danger border-dashed rounded-md p-5"><div class="flex justify-between"><div data-svelte-h="svelte-m7itvx"><p class="text-lg">Delete Vendor</p> <p class="text-black/50">Remove all data related to vendor.Once you take this action their is no going back</p></div> <button class="bg-danger flex text-white rounded-md py-2 px-6">${validate_component(Delete_svg, "Delete").$$render($$result, {}, {}, {})} Delete Vendor</button></div></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="mx-10 my-12"><p class="text-sm mb-5">Vendor / ${escape(data.editVendorForm.data.name)}</p>  <div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6"><button><p class="${"py-2 px-3 rounded-md " + escape("bg-white", true)}">Info</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Payments</p></button></div>  <div class="bg-white rounded-sm shadow-sm border-[1px] border-black/20">${`${validate_component(Info, "Info").$$render(
      $$result,
      { data },
      {
        data: ($$value) => {
          data = $$value;
          $$settled = false;
        }
      },
      {}
    )}`}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};

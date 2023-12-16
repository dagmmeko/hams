import { c as create_ssr_component, b as subscribe, h as spread, j as escape_object, f as each, a as add_attribute, k as escape_attribute_value, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { s as superForm, g as goto } from "../../../../chunks/index3.js";
import { t as toast } from "../../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
import { F as File_upload_svg } from "../../../../chunks/file-upload.svg.js";
import { F as File_up_svg } from "../../../../chunks/file-up.svg.js";
import dayjs from "dayjs";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $constraints, $$unsubscribe_constraints;
  let $addTenantForm, $$unsubscribe_addTenantForm;
  let { data } = $$props;
  let { form } = $$props;
  const { form: addTenantForm, enhance: addTenantEnhance, constraints } = superForm(data.addTenantForm);
  $$unsubscribe_addTenantForm = subscribe(addTenantForm, (value) => $addTenantForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  let dateInput;
  let dateInput2;
  let frontFileData = [];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  form?.addTenant && goto("/tenants");
  form?.addTenant && toast.push("Tenant added successfully", { theme: { "--toastBacground": "#059669" } });
  $$unsubscribe_constraints();
  $$unsubscribe_addTenantForm();
  return `<div class="mt-6 mx-10"><p class="text-xs text-black/50" data-svelte-h="svelte-z76fqi">Tenants / New Tenants</p> <div class="bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20"><div class="" data-svelte-h="svelte-slh5b7"><p class="text-2xl font-medium">New Tenant</p> <p class="text-sm py-2">Register new Tenant here. Click save when you&#39;re done.</p></div> <form method="post" action="?/addTenant" class="mt-6"><div class="flex flex-wrap gap-x-20 my-6"><label class="grid gap-2 h-fit"><span class="text-primary font-medium" data-svelte-h="svelte-vb6eem">Unit Type</span> <select${spread(
    [
      { required: true },
      { name: "rentalUnitsId" },
      escape_object($constraints.rentalUnitsId),
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}><option selected disabled value=" Pick a Type " data-svelte-h="svelte-1aj00tp">Pick a Type </option>${each(data.rentalUnits, (unit) => {
    return `<option${add_attribute("value", unit.id, 0)}>${escape(unit.roomNumber)} </option>`;
  })}</select></label> <div>${``}</div></div> <hr> <div class="flex flex-wrap gap-x-20 my-6 gap-y-6"><label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-1ooxtwg">Full Name</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "fullName" },
      escape_object($constraints.fullName)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.fullName, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-1wyfy8p">Phone Number</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "phoneNumber" },
      escape_object($constraints.phoneNumber)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.phoneNumber, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-1qk1yd0">Email</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "email" },
      escape_object($constraints.email)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.email, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-ybtie0">Purpose of Visit</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "purposeOfRent" },
      escape_object($constraints.purposeOfRent)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.purposeOfRent, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-d3vdci">Contract Start Date</span> <input${spread(
    [
      { type: "date" },
      { name: "contractStartDate" },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
      },
      escape_object($constraints.contractStartDate),
      {
        min: escape_attribute_value((/* @__PURE__ */ new Date()).toISOString().substr(0, 10))
      }
    ],
    {}
  )}${add_attribute("this", dateInput, 0)}${add_attribute("value", $addTenantForm.contractStartDate, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-bmv323">Contract End Date</span> <input${spread(
    [
      { type: "date" },
      { name: "contractEndDate" },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
      },
      escape_object($constraints.contractEndDate),
      {
        min: escape_attribute_value(!$addTenantForm.contractStartDate ? void 0 : dayjs(new Date($addTenantForm.contractStartDate)).add(0, "D").toISOString().substr(0, 10))
      }
    ],
    {}
  )}${add_attribute("this", dateInput2, 0)}${add_attribute("value", $addTenantForm.contractEndDate, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-1376xtx">Duration of Stay In Country</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "price" },
      escape_object($constraints.durationOfStayInCountry)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.durationOfStayInCountry, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-1lb1t08">Emergency Contact Name</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "emergencyContactName" },
      escape_object($constraints.emergencyContactName)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.emergencyContactName, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-1chi0gj">Emergency Contact Email</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { type: "email" },
      { name: "emergencyContactEmail" },
      escape_object($constraints.emergencyContactEmail)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.emergencyContactEmail, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-z3v5ey">Emergency Contact Phone Number</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { type: "tel" },
      { name: "emergencyContactPhoneNumber" },
      escape_object($constraints.emergencyContactPhoneNumber)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.emergencyContactPhoneNumber, 0)}></label> <label class="grid gap-2"><span class="text-primary font-medium" data-svelte-h="svelte-1357btt">Tenant Internal Score</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "tenantScore" },
      escape_object($constraints.tenantScore)
    ],
    {}
  )}${add_attribute("value", $addTenantForm.tenantScore, 0)}></label></div> <hr class="my-4"> <label><input class="hidden" type="file" name="tenantFile" accept="image/*" multiple> <div class="flex-1 flex-shrink-0 grid grid-cols-4 items-start gap-2">${each(frontFileData, (file) => {
    return `<div class="relative border-[1px] max-w-[180px] border-primary border-dashed rounded-lg gap-2 items-center justify-center"><div class="relative z-10 w-32 h-36"></div> <div class="absolute top-0 w-full h-full left-0 z-30"><div class="flex flex-col gap-2 justify-center items-center h-full">${validate_component(File_upload_svg, "FileUpload").$$render(
      $$result,
      {
        class: "h-6 w-6 flex-shrink-0 ml-2 text-black"
      },
      {},
      {}
    )} <p class="text-sm ml-2 py-2">${escape(file)}</p> <button data-svelte-h="svelte-cx397v">x</button> </div></div> </div>`;
  })} <div class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"><div class="relative z-10 w-32 h-36"></div> <div class="absolute top-0 w-full h-full left-0 z-30"><div class="flex flex-col gap-2 justify-center items-center h-full">${validate_component(File_up_svg, "FileUp").$$render($$result, { class: "text-primary w-7 h-7" }, {}, {})} <span class="text-xs" data-svelte-h="svelte-159olw1">Upload File</span></div></div></div></div></label> <hr class="my-6"> <button class="bg-primary text-white rounded-md py-2 px-6 w-[420px] mt-6" data-svelte-h="svelte-7adutv">Create Tenant</button></form></div></div>`;
});
export {
  Page as default
};

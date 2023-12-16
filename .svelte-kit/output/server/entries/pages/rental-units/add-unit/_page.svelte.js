import { c as create_ssr_component, b as subscribe, h as spread, j as escape_object, a as add_attribute, f as each, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { s as superForm, g as goto } from "../../../../chunks/index3.js";
import { F as File_up_svg } from "../../../../chunks/file-up.svg.js";
import { F as File_upload_svg } from "../../../../chunks/file-upload.svg.js";
import { t as toast } from "../../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $constraints, $$unsubscribe_constraints;
  let $addUnitForm, $$unsubscribe_addUnitForm;
  let { data } = $$props;
  let { form } = $$props;
  const { form: addUnitForm, enhance: addFormEnhance, constraints } = superForm(data.addUnitForm);
  $$unsubscribe_addUnitForm = subscribe(addUnitForm, (value) => $addUnitForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  let frontFileData = [];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  form?.addUnitForm && goto("/rental-units");
  form?.addUnitForm && toast.push("Unit added successfully", {
    theme: { "--toastBackground": "#059669" }
  });
  $$unsubscribe_constraints();
  $$unsubscribe_addUnitForm();
  return `<div class="mt-6 mx-10"><p class="text-xs text-black/50" data-svelte-h="svelte-i5rwzv">Rental Units / New Rental Unit</p> <div class="bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20"><div class="" data-svelte-h="svelte-1etlp8r"><p class="text-2xl font-medium">New Rental Unit</p> <p class="text-sm py-2">Register new rental unit here. Click save when you&#39;re done.</p></div> <form method="post" action="?/addUnit" class="grid grid-flow-col mt-6"><div class="flex flex-col gap-4"><label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-skqjvc">Room Number</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "roomNumber" },
      escape_object($constraints.roomNumber)
    ],
    {}
  )}${add_attribute("value", $addUnitForm.roomNumber, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1izyz7u">Floor</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "floor" },
      escape_object($constraints.floor)
    ],
    {}
  )}${add_attribute("value", $addUnitForm.floor, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-17ttnzl">Size</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "size" },
      escape_object($constraints.size)
    ],
    {}
  )}${add_attribute("value", $addUnitForm.size, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-d93npj">Price</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { required: true },
      { name: "price" },
      escape_object($constraints.price)
    ],
    {}
  )}${add_attribute("value", $addUnitForm.price, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-vb6eem">Unit Type</span> <select${spread(
    [
      { required: true },
      { name: "unitType" },
      escape_object($constraints.unitType),
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}><option selected disabled value=" Pick a Type " data-svelte-h="svelte-1aj00tp">Pick a Type </option><option value="RESIDENTIAL" data-svelte-h="svelte-hqukqe">Residential </option><option value="COMMERCIAL" data-svelte-h="svelte-16kaelq">Commercial</option></select></label> <hr class="my-4"> <label><input class="hidden" type="file" name="unitFile" accept="image/*" multiple> <div class="flex-1 flex-shrink-0 grid grid-cols-4 items-start gap-2">${each(frontFileData, (file) => {
    return `<div class="relative border-[1px] max-w-[180px] border-primary border-dashed rounded-lg gap-2 items-center justify-center"><div class="relative z-10 w-32 h-36"></div> <div class="absolute top-0 w-full h-full left-0 z-30"><div class="flex flex-col gap-2 justify-center items-center h-full">${validate_component(File_upload_svg, "FileUpload").$$render(
      $$result,
      {
        class: "h-6 w-6 flex-shrink-0 ml-2 text-black"
      },
      {},
      {}
    )} <p class="text-sm ml-2 py-2">${escape(file)}</p> </div></div> </div>`;
  })} <div class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"><div class="relative z-10 w-32 h-36"></div> <div class="absolute top-0 w-full h-full left-0 z-30"><div class="flex flex-col gap-2 justify-center items-center h-full">${validate_component(File_up_svg, "FileUp").$$render($$result, { class: "text-primary w-7 h-7" }, {}, {})} <span class="text-xs" data-svelte-h="svelte-159olw1">Upload File</span></div></div></div></div></label> <hr class="my-6"> <button class="bg-primary text-white rounded-md py-2 px-6 w-fit" data-svelte-h="svelte-1pwbqq3">Create unit</button></div> <div class="flex flex-col gap-4"><label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-997ccj">Condition</span> <select${spread(
    [
      { required: true },
      { name: "condition" },
      escape_object($constraints.condition),
      {
        class: "mt-2 w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}><option selected disabled value=" Pick a role " data-svelte-h="svelte-lmv8w1">Pick a role </option><option value="OUT_OF_SERVICE" data-svelte-h="svelte-gc4am0">Out of service </option><option value="NEEDS_REPAIR" data-svelte-h="svelte-11a5bvt">Needs Repair </option><option value="GOOD_CONDITION" data-svelte-h="svelte-pmjewb">Good Condition</option></select></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-3gd66c">Minimum Rental Day</span> <input${spread(
    [
      { required: true },
      { name: "minimumRentalDate" },
      escape_object($constraints.minimumRentalDate),
      {
        class: "w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addUnitForm.minimumRentalDate, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-14oxv5h">Number of People Allowed</span> <input${spread(
    [
      { required: true },
      { name: "maximumTenants" },
      escape_object($constraints.maximumTenants),
      {
        class: "w-[420px] h-12 border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addUnitForm.maximumTenants, 0)}></label></div></form></div></div>`;
});
export {
  Page as default
};

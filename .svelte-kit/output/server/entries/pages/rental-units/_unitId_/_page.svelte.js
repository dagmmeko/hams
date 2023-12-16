import { c as create_ssr_component, a as add_attribute, b as subscribe, h as spread, j as escape_object, f as each, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
/* empty css                                                            */import { s as superForm, g as goto } from "../../../../chunks/index3.js";
import "../../../../chunks/index.js";
import { D as Delete_svg } from "../../../../chunks/delete.svg.js";
import { F as File_up_svg } from "../../../../chunks/file-up.svg.js";
import { t as toast } from "../../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
const amenities_svelte_svelte_type_style_lang = "";
const FileBg = "/_app/immutable/assets/file-bg.3ee1c32e.png";
const Eye_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="eye"><g id="Vector"><path d="M2.5 15C2.5 15 6.25 6.25 15 6.25C23.75 6.25 27.5 15 27.5 15C27.5 15 23.75 23.75 15 23.75C6.25 23.75 2.5 15 2.5 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></g></svg>`;
});
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $constraints, $$unsubscribe_constraints;
  let $editUnitForm, $$unsubscribe_editUnitForm;
  let { data } = $$props;
  let { form } = $$props;
  const { form: editUnitForm, enhance: editUnitFormEnhance, constraints } = superForm(data.editUnitForm);
  $$unsubscribe_editUnitForm = subscribe(editUnitForm, (value) => $editUnitForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  {
    form?.deleteFile ? toast.push("File deleted successfully", {
      theme: { "--toastBackground": "#059669" }
    }) : null;
  }
  {
    form?.fileUrl ? window.open(form.fileUrl, "_blank") : null;
  }
  {
    form?.deletedUnit ? goto("/rental-units") : null;
  }
  $$unsubscribe_constraints();
  $$unsubscribe_editUnitForm();
  return `<div><form method="post" action="?/editUnitInfo"><div class="flex justify-between" data-svelte-h="svelte-1k1gvb3"><div class="grid"><p class="text-2xl">Rental Unit Info</p> <p class="text-sm py-1 rounded-xl">Room details here.</p></div> <button type="submit" class="bg-primary text-white rounded-md py-2 px-6">Update Info</button></div> <hr class="my-6"> <div class="grid gap-6 grid-cols-4"><label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1v9xchz">Room No.</span> <input${spread([{ name: "roomNumber" }, escape_object($constraints.roomNumber), { class: "" }], {})}${add_attribute("value", $editUnitForm.roomNumber, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-ykuqat">Floor</span> <input${spread([{ name: "floor" }, escape_object($constraints.floor), { class: "" }], {})}${add_attribute("value", $editUnitForm.floor, 0)}></label> <div class="grid flex-1" data-svelte-h="svelte-uy5ysb"><span class="text-primary font-semibold py-1">Status</span> <div>Available</div></div> <label class="grid"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-18ghvsa">Condition</span> <select${spread(
    [
      { required: true },
      { name: "condition" },
      escape_object($constraints.condition)
    ],
    {}
  )}><option selected disabled value=" Pick a role " data-svelte-h="svelte-lmv8w1">Pick a role </option><option value="OUT_OF_SERVICE" data-svelte-h="svelte-gc4am0">Out of service </option><option value="NEEDS_REPAIR" data-svelte-h="svelte-11a5bvt">Needs Repair </option><option value="GOOD_CONDITION" data-svelte-h="svelte-pmjewb">Good Condition</option></select></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-44nq3c">Size</span> <input${spread([{ name: "size" }, escape_object($constraints.size)], {})}${add_attribute("value", $editUnitForm.size, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-14pox2">Price</span> <input${spread([{ name: "price" }, escape_object($constraints.price)], {})}${add_attribute("value", $editUnitForm.price, 0)}></label> <label class="grid"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-hdynht">Unit Type</span> <select${spread([{ required: true }, { name: "unitType" }, escape_object($constraints.unitType)], {})}><option selected disabled value=" Pick a Type " data-svelte-h="svelte-1aj00tp">Pick a Type </option><option value="RESIDENTIAL" data-svelte-h="svelte-hqukqe">Residential </option><option value="COMMERCIAL" data-svelte-h="svelte-16kaelq">Commercial</option></select></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1r09zsw">No. of People Allowed</span> <input${spread([{ name: "maximumTenants" }, escape_object($constraints.maximumTenants)], {})}${add_attribute("value", $editUnitForm.maximumTenants, 0)}></label></div> <div class="w-full p-4 mb-8 flex-1 flex-shrink-0 flex flex-wrap items-start gap-2">${each(data.unitDetails?.UnitsFile ?? [], (file) => {
    return `<div class="border-[1px] w-[180px] border-primary border-dashed rounded-lg"><div class="relative"><div class="relative z-10 w-full h-36" data-svelte-h="svelte-1wu92y6"><img${add_attribute("src", FileBg, 0)} alt="bg" class="w-full h-full"></div> <div class="absolute top-0 w-full h-full left-0 z-30"><div class="flex flex-col gap-2 justify-center items-center h-full"><form method="post" action="?/downloadUnitFile"><button type="submit"><div class="h-full flex flex-col items-center justify-center">${validate_component(Eye_svg, "Eye").$$render($$result, { class: "text-primary w-7 h-7" }, {}, {})} <p class="text-sm ml-2 flex-1 line-clamp-1 py-2">${escape(file.File.fileName)}</p> </div></button> </form></div> </div></div> <form method="post" action="?/deleteUnitFile"><button class="flex gap-1 items-center justify-center w-full p-2">${validate_component(Delete_svg, "Delete").$$render($$result, { class: "h-5 w-5 text-danger" }, {}, {})} <span class="text-danger text-sm" data-svelte-h="svelte-1nh84sx">Delete</span> </button></form> </div>`;
  })} <div class="relative border-[1px] border-primary border-dashed rounded-lg flex-1 flex-shrink-0 max-w-[180px] max-h-96 gap-2 items-center justify-center"><form method="post" action="?/editUnitFile"><label><input class="hidden" type="file" name="unitFile" accept="image/*" multiple> <div class="relative z-10 h-44"></div> <div class="absolute top-0 w-full h-full left-0 z-30"><div class="flex flex-col gap-2 justify-center items-center h-full">${validate_component(File_up_svg, "FileUp").$$render($$result, { class: "text-primary w-7 h-7" }, {}, {})} <span class="text-xs" data-svelte-h="svelte-159olw1">Upload File</span></div></div></label></form></div></div> <hr class="my-6"></form> <p class="text-2xl mt-10" data-svelte-h="svelte-3o2v2v">Danger</p> <hr class="my-6"> <div class="border-2 border-danger border-dashed rounded-md p-5"><div class="flex justify-between"><div data-svelte-h="svelte-f20vrw"><p class="text-lg">Archive Rental Unit</p> <p class="text-black/50">Remove all data related to rental unit. Once you take this action there is no going back.</p></div> <form method="post" action="?/archiveUnit" data-svelte-h="svelte-1qsa057"><button class="bg-danger text-white rounded-md py-2 px-6">Archive</button></form></div></div></div>`;
});
const properties_svelte_svelte_type_style_lang = "";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="mt-6 mx-10"><p class="text-xs text-black/50 mb-5" data-svelte-h="svelte-wpvm5d">Rental Units / Room 101</p>  <div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6"><button><p class="${"py-2 px-3 rounded-md " + escape("bg-white", true)}">Room</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Properties</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Amenities</p></button></div> <div class="bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20">${`${validate_component(Info, "Info").$$render(
      $$result,
      { form, data },
      {
        form: ($$value) => {
          form = $$value;
          $$settled = false;
        },
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

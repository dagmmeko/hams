import { c as create_ssr_component, e as escape, b as subscribe, v as validate_component, h as spread, j as escape_object, a as add_attribute } from "../../../chunks/ssr.js";
import { t as toast } from "../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
import { F as Filters_lines_svg } from "../../../chunks/filters-lines.svg.js";
import { p as page } from "../../../chunks/stores.js";
import dayjs from "dayjs";
import { S as SvelteTable } from "../../../chunks/SvelteTable.js";
import { s as superForm } from "../../../chunks/index3.js";
/* empty css                                                         */import "../../../chunks/index.js";
const Name = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { row } = $$props;
  if ($$props.row === void 0 && $$bindings.row && row !== void 0)
    $$bindings.row(row);
  return `<div class="grid grid-flow-col items-center"><div class="bg-ghost/60 w-10 h-10 rounded-full flex items-center justify-center" data-svelte-h="svelte-kvrtut"><div class="text-purple-500 text-lg">DM</div></div> <div class="font-inter text-base font-medium">${escape(row.name)}</div></div>`;
});
const Vendors = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rows;
  let columns;
  let $$unsubscribe_page;
  let $constraints, $$unsubscribe_constraints;
  let $addVendorForm, $$unsubscribe_addVendorForm;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let modal = false;
  let { data } = $$props;
  const { form: addVendorForm, enhance: addVendorFormEnhance, constraints } = superForm(data.addVendorForm, {
    onUpdate: () => {
      modal = false;
    }
  });
  $$unsubscribe_addVendorForm = subscribe(addVendorForm, (value) => $addVendorForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  rows = data.vendor ?? [];
  columns = [
    {
      key: "Name",
      title: "",
      renderComponent: { component: Name },
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "service",
      title: "Service",
      value: (v) => v.serviceType || "",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "phone",
      title: "Phone number",
      value: (v) => v.phoneNumber || "",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "email",
      title: "Email address",
      value: (v) => v.email || "",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "Score",
      title: "Score",
      value: (v) => v.score || "",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "Start_date",
      title: "Contact start Date",
      value: (v) => dayjs(v.createdAt).format("MMM DD, YYYY"),
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    }
  ];
  $$unsubscribe_page();
  $$unsubscribe_constraints();
  $$unsubscribe_addVendorForm();
  return `<div class="bg-white rounded-sm shadow-md border-[1px] border-black/20"><div class="flex justify-between p-6"><div class="flex space-x-4" data-svelte-h="svelte-gvn2lf"><p class="text-lg">Vendors</p> <p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Vendors</p></div> <button class="bg-primary text-white rounded-md py-2 px-6" data-svelte-h="svelte-1kv2el0">New Vendor</button></div> <div class="bg-ghost/60 p-6 flex justify-between"><button class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 mx-3 text-sm shadow-md bg-white">${validate_component(Filters_lines_svg, "FiltersLines").$$render($$result, { class: "h-4 w-4" }, {}, {})} Add filters</button> <label class="grid"><input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" type="search" id="search" name="search" placeholder="Search"></label></div> ${validate_component(SvelteTable, "SvelteTable").$$render(
    $$result,
    {
      classNameTable: "rolesTable",
      columns,
      rows
    },
    {},
    {}
  )}</div> ${modal ? `<form class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center" method="post" action="?/addVendor"><div class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"><div data-svelte-h="svelte-10rfmom"><p class="text-xl font-semibold">New Vendor</p> <p class="text-sm text-subtitle pt-2">Register new tenants here. Click save when you&#39;re done.</p></div> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-ubzh6f">Vendor Name</span> <input${spread(
    [
      escape_object($constraints.name),
      { name: "name" },
      { required: true },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addVendorForm.name, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1wyfy8p">Phone Number</span> <input${spread(
    [
      escape_object($constraints.phoneNumber),
      { name: "phoneNumber" },
      { required: true },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addVendorForm.phoneNumber, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1qk1yd0">Email</span> <input${spread(
    [
      escape_object($constraints.email),
      { name: "email" },
      { required: true },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addVendorForm.email, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-qvhd28">Address</span> <input${spread(
    [
      escape_object($constraints.address),
      { name: "address" },
      { required: true },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addVendorForm.address, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1n5728b">Service Description</span> <input${spread(
    [
      escape_object($constraints.serviceDescription),
      { name: "serviceDescription" },
      { required: true },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addVendorForm.serviceDescription, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-4x8so9">Service Type</span> <select${spread(
    [
      escape_object($constraints.serviceType),
      { name: "serviceType" },
      { required: true },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}><option selected disabled value=" Select Type " data-svelte-h="svelte-1sez54z">Select Type </option><option value="CLEANING" data-svelte-h="svelte-dmobku">Cleaning</option><option value="ELECTRICITY" data-svelte-h="svelte-15yhmh8">Electricity</option><option value="PLUMBING" data-svelte-h="svelte-1k1pmdm">Pluming</option><option value="PAINTING" data-svelte-h="svelte-1tk0kvi">Painting</option><option value="SECURITY" data-svelte-h="svelte-ygp9ue">Security</option></select></label> <label><span class="text-primary font-medium" data-svelte-h="svelte-bjrzum">Score</span> <input${spread(
    [
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2"
      },
      { type: "number" },
      { min: "1" },
      { max: "10" },
      { step: "0.1" },
      escape_object($constraints.score),
      { name: "score" },
      { required: true }
    ],
    {}
  )}${add_attribute("value", $addVendorForm.score, 0)}></label> <button class="bg-primary text-white rounded-md py-2" data-svelte-h="svelte-1whgdju">Save Vendor</button></div></form>` : ``}`;
});
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
    {
      form?.addVendorForm ? toast.push("Vendor added successfully") : null;
    }
    $$rendered = `<div class="mx-10 my-5"><p class="text-xs text-black/50 mb-5" data-svelte-h="svelte-zhcbvm">Vendor</p> <div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6"><button><p class="${"py-2 px-3 rounded-md " + escape("bg-white", true)}">Vendor</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Task</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Pending Tasks</p></button></div> ${`${validate_component(Vendors, "Vendors").$$render(
      $$result,
      { data },
      {
        data: ($$value) => {
          data = $$value;
          $$settled = false;
        }
      },
      {}
    )}`}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};

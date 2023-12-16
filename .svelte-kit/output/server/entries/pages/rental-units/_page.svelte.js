import { c as create_ssr_component, v as validate_component, b as subscribe } from "../../../chunks/ssr.js";
import { F as Filters_lines_svg } from "../../../chunks/filters-lines.svg.js";
import { p as page } from "../../../chunks/stores.js";
import { D as Delete_svg } from "../../../chunks/delete.svg.js";
import "../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
import { s as superForm } from "../../../chunks/index3.js";
import { S as SvelteTable } from "../../../chunks/SvelteTable.js";
const Unit_table_delete_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { row } = $$props;
  let { data } = $$props;
  superForm(data.deleteUnitForm, {
    onSubmit: ({ formData, cancel }) => {
      if (!window.confirm("Are you sure you want to delete this Unit?")) {
        cancel();
      }
      formData.set("deleteUnitId", row.id);
    }
  });
  if ($$props.row === void 0 && $$bindings.row && row !== void 0)
    $$bindings.row(row);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="">${row.TenantRental.length > 0 && row.TenantRental[0].Tenant.active ? `<button>${validate_component(Delete_svg, "Delete").$$render($$result, { class: "text-subtitle" }, {}, {})}</button>` : `<form method="post" action="?/archiveUnit"><button>${validate_component(Delete_svg, "Delete").$$render($$result, { class: "text-danger" }, {}, {})}</button></form>`}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rows;
  let columns;
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  rows = data.units;
  columns = [
    {
      key: "roomNo",
      title: "Room Number",
      value: (v) => v.roomNumber ?? "NOT FOUND",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "floor",
      title: "Floor",
      value: (v) => v.floor ?? "NOT FOUND",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "status",
      title: "Status",
      value: (v) => v.active ? "Occupied" : "Vacant",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "condition",
      title: "Condition",
      value: (v) => v.Inspection[0].InspectionStatus ?? "NOT FOUND",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "unitType",
      title: "Unit Type",
      value: (v) => v.unitType ?? "NOT FOUND",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "size",
      title: "Size",
      value: (v) => v.kareMeter ?? "NOT FOUND",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "price",
      title: "Price",
      value: (v) => v.price ?? "NOT FOUND",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "second",
      title: "",
      renderComponent: {
        component: Unit_table_delete_button,
        props: { data }
      },
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    }
  ];
  $$unsubscribe_page();
  return `<div class="mx-10 my-12 bg-white rounded-sm shadow-md border-[1px] border-black/20"><div class="flex justify-between p-6"><div class="flex space-x-4" data-svelte-h="svelte-1ej7x47"><p class="text-lg">Rental Units</p> <p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Units</p></div> <a href="/rental-units/add-unit" class="bg-primary text-white rounded-md py-2 px-6" data-svelte-h="svelte-65cl7r">New Rental Unit</a></div> <div class="bg-ghost/60 p-6 flex justify-between"><button class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white">${validate_component(Filters_lines_svg, "FiltersLines").$$render($$result, { class: "h-4 w-4" }, {}, {})} Add filters</button> <label class="grid"><input placeholder="Search" class="w-[420px] border-[1px] border-black/60 rounded-md p-2" type="search" id="search" name="search"></label></div> ${validate_component(SvelteTable, "SvelteTable").$$render(
    $$result,
    {
      classNameTable: "rolesTable",
      columns,
      rows
    },
    {},
    {}
  )}</div>`;
});
export {
  Page as default
};

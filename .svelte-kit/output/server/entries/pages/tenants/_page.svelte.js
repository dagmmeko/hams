import { c as create_ssr_component, a as add_attribute, e as escape, v as validate_component, b as subscribe } from "../../../chunks/ssr.js";
import { F as Filters_lines_svg } from "../../../chunks/filters-lines.svg.js";
import { p as page } from "../../../chunks/stores.js";
import { S as SvelteTable } from "../../../chunks/SvelteTable.js";
import { Q as QR } from "../../../chunks/qr.js";
import "dayjs";
import { D as Delete_svg } from "../../../chunks/delete.svg.js";
const Name = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { row } = $$props;
  if ($$props.row === void 0 && $$bindings.row && row !== void 0)
    $$bindings.row(row);
  return `<div class="grid grid-flow-col w-fit gap-6 items-center"><img${add_attribute("src", QR, 0)} alt="img" class="w-10 h-10 rounded-full"> <div class="grid"><span class="text-sm font-medium">${escape(row.fullName)}</span> <span class="text-xs"><span class="text-primary" data-svelte-h="svelte-hh2trj">Score</span> ${escape(row.tenantScore)}</span></div></div>`;
});
const Delete_tenant_table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${validate_component(Delete_svg, "Delete").$$render($$result, { class: "text-danger" }, {}, {})}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rows;
  let columns;
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    rows = data.tenants || [];
    columns = [
      {
        key: "tenant",
        title: "Tenant",
        renderComponent: { component: Name },
        headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
        class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
      },
      {
        key: "phoneNumber",
        title: "Phone Number",
        value: (v) => v.phoneNumber ?? "NOT FOUND",
        headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
        class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
      },
      {
        key: "email",
        title: "Email",
        value: (v) => v.email ?? "NOT FOUND",
        headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
        class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
      },
      {
        key: "activeRoom",
        title: "Active room",
        value: (v) => v.email ?? "NOT FOUND",
        headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
        class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
      },
      {
        key: "delete",
        title: "",
        renderComponent: { component: Delete_tenant_table },
        headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
        class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
      }
    ];
    $$rendered = `<div class="mx-10 my-12"><div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6"><button><p class="${"py-2 px-3 rounded-md " + escape("bg-white", true)}">Tenant</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Pending</p></button></div> ${`<div class="bg-white rounded-md shadow-md border-[1px] border-black/20 mt-3"><div class="flex justify-between p-6" data-svelte-h="svelte-by81qv"><div class="flex space-x-4"><p class="text-lg">Tenants</p> <p class="bg-[#F9F5FF] text-xs rounded-xl p-2">100 Tenants</p></div> <div><a href="/tenants/rent-room" class="border-[1px] border-primary text-primary shadow-sm mr-2 rounded-md py-2 px-6">Rent Room</a> <a href="/tenants/add-tenant" class="bg-primary text-white shadow-sm rounded-md py-2 px-6">New Tenant</a></div></div> <div class="bg-ghost/60 p-6 flex justify-between"><button class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white">${validate_component(Filters_lines_svg, "FiltersLines").$$render($$result, { class: "h-4 w-4" }, {}, {})} Add filters</button> <label class="grid"><input placeholder="Search" class="w-[420px] border-[1px] border-black/60 rounded-md p-2" type="search" id="search" name="search"></label></div> ${validate_component(SvelteTable, "SvelteTable").$$render($$result, { columns, rows }, {}, {})}</div>`}</div>`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};

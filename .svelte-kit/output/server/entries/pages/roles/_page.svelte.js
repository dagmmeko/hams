import { c as create_ssr_component, v as validate_component, b as subscribe, e as escape } from "../../../chunks/ssr.js";
import { S as SvelteTable } from "../../../chunks/SvelteTable.js";
import dayjs from "dayjs";
import { p as page } from "../../../chunks/stores.js";
import { D as Delete_svg } from "../../../chunks/delete.svg.js";
import { t as toast } from "../../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
import { s as superForm } from "../../../chunks/index3.js";
const Delete_role_table_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { row } = $$props;
  let { data } = $$props;
  superForm(data.deleteRoleForm, {
    onSubmit: ({ formData, cancel }) => {
      if (!window.confirm("Are you sure you want to delete this role?")) {
        cancel();
      }
      formData.set("deleteRoleId", row.id);
    }
  });
  if ($$props.row === void 0 && $$bindings.row && row !== void 0)
    $$bindings.row(row);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div>${row.Employees.length ? `<button>${validate_component(Delete_svg, "Delete").$$render($$result, { class: "text-subtitle" }, {}, {})}</button>` : `<form method="post" action="?/archiveRole"><button>${validate_component(Delete_svg, "Delete").$$render($$result, { class: "text-danger" }, {}, {})}</button></form>`}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rows;
  let columns;
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { form } = $$props;
  let { data } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  rows = data.roles;
  columns = [
    {
      key: "title",
      title: "Role",
      value: (v) => v?.name ?? "",
      headerClass: "text-left pl-2 bg-ghost/60 w-1/3 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "noOfEmployees",
      title: "No. of Employees",
      value: (v) => v?.Employees.length ?? "",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "createdAt",
      title: "Created At",
      value: (v) => dayjs(v?.createdAt).format("MMM DD, YYYY") ?? "",
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "delete",
      title: "",
      renderComponent: {
        component: Delete_role_table_component,
        props: { data }
      },
      headerClass: "bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "border-b-[1px] border-[#B3B4B8]"
    }
  ];
  {
    form?.deleteRoleForm ? toast.push("Role deleted successfully") : null;
  }
  $$unsubscribe_page();
  return `<div><div class="mx-10 my-12 bg-white rounded-sm shadow-lg border-[1px] border-black/20"><div class="flex justify-between p-6"><div class="flex items-center space-x-4"><p class="text-xl font-medium" data-svelte-h="svelte-1benmd3">Roles</p> <p class="bg-[#F9F5FF] text-xs font-medium rounded-xl py-2 px-3">${escape(data.roles.length)} Roles</p></div> <a href="/roles/add-role" class="bg-primary text-white text-sm rounded-md py-2 px-6" data-svelte-h="svelte-568voq">New Role</a></div> <div class="bg-ghost/60 p-6 flex justify-between border-b-2 border-ghost"> <label class="grid"><input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" type="search" id="search" name="search" placeholder="Search"></label></div> ${validate_component(SvelteTable, "SvelteTable").$$render(
    $$result,
    {
      classNameTable: "rolesTable",
      columns,
      rows
    },
    {},
    {}
  )}</div></div>`;
});
export {
  Page as default
};

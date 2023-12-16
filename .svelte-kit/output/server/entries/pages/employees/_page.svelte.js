import { c as create_ssr_component, a as add_attribute, e as escape, v as validate_component, b as subscribe, h as spread, j as escape_object, f as each } from "../../../chunks/ssr.js";
import { S as SvelteTable } from "../../../chunks/SvelteTable.js";
import { Q as QR } from "../../../chunks/qr.js";
import { F as Filters_lines_svg } from "../../../chunks/filters-lines.svg.js";
import dayjs from "dayjs";
import { p as page } from "../../../chunks/stores.js";
import { s as superForm } from "../../../chunks/index3.js";
const Name = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { row } = $$props;
  if ($$props.row === void 0 && $$bindings.row && row !== void 0)
    $$bindings.row(row);
  return `<div class="grid grid-flow-col w-fit gap-6 items-center"><img${add_attribute("src", QR, 0)} alt="img" class="w-10 h-10 rounded-full"> <div class="grid"><span class="text-sm font-medium">${escape(row.User.userName)}</span> <span class="text-xs">${escape(row.staffIdNumber)}</span></div></div>`;
});
const Dot_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="_Dot"><circle id="Dot" cx="4.00002" cy="4" r="3" fill="currentColor"></circle></g></svg>`;
});
const Status_component = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { row } = $$props;
  let { data } = $$props;
  if ($$props.row === void 0 && $$bindings.row && row !== void 0)
    $$bindings.row(row);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="${"flex items-center justify-center gap-1 " + escape(
    row.isFired ? "bg-danger/20 text-danger text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit" : row.isSuspended ? "bg-danger/20 text-danger text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit" : row.onLeave ? "bg-warning/20 text-[#F0AF00] text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit" : row.isAbsent ? "bg-danger/20 text-danger text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit" : row.EmploymentType === "FULL_TIME" ? "bg-success/20 text-success text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit" : row.EmploymentType === "PART_TIME" ? "bg-info/20 text-info text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit" : "bg-blue-300/50 text-blue-600 text-xs rounded-full py-1 px-2 font-semibold w-24 h-fit",
    true
  ) + "}"}">${validate_component(Dot_svg, "Dot").$$render($$result, {}, {}, {})} ${escape(row.isFired ? "Fired" : row.isSuspended ? "Suspended" : row.onLeave ? "On Leave" : row.isAbsent ? "Absent" : row.EmploymentType === "FULL_TIME" ? "Full Time" : row.EmploymentType === "PART_TIME" ? "Part Time" : "Temporary")}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rows;
  let columns;
  let $$unsubscribe_page;
  let $constraints, $$unsubscribe_constraints;
  let $addEmployeeForm, $$unsubscribe_addEmployeeForm;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { data } = $$props;
  let modal = false;
  const { form: addEmployeeForm, enhance: addEmployeeFormEnhance, constraints } = superForm(data.addEmployeeForm, {
    onUpdate: () => {
      modal = false;
    }
  });
  $$unsubscribe_addEmployeeForm = subscribe(addEmployeeForm, (value) => $addEmployeeForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  let dateInput;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  rows = data.employees;
  columns = [
    {
      key: "name",
      title: "Name",
      renderComponent: { component: Name, props: { data } },
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "status",
      title: "Status",
      renderComponent: {
        component: Status_component,
        props: { data }
      },
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "role",
      title: "Role",
      value: (v) => v.Role.name,
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "email",
      title: "Email",
      value: (v) => v.User.email,
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "jobTitle",
      title: "Job Title",
      value: (v) => v.jobTitle,
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    },
    {
      key: "hiredOn",
      title: "Hired Date",
      value: (v) => dayjs(v.hiredDate).format("MMM DD, YYYY"),
      headerClass: "text-left pl-2 bg-ghost/60 border-b-[1px] border-[#B3B4B8] text-[#141B29] font-medium text-sm h-12",
      class: "text-left pl-2 h-12 border-b-[1px] border-[#B3B4B8]"
    }
  ];
  $$unsubscribe_page();
  $$unsubscribe_constraints();
  $$unsubscribe_addEmployeeForm();
  return `<div class="mx-10 my-12 bg-white rounded-sm shadow-md border-[1px] border-black/20"><div class="flex justify-between p-6"><div class="flex items-center space-x-4 h-fit"><p class="text-lg" data-svelte-h="svelte-wfvkz5">Employees</p> <p class="bg-[#F9F5FF] text-xs py-1 px-2 rounded-xl">${escape(data.employees.length)} Employees</p></div> <button class="bg-primary text-white rounded-md py-2 px-6" data-svelte-h="svelte-j8c6k3">Add Employee</button></div> <div class="bg-ghost/60 p-6 flex justify-between"><button class="grid grid-flow-col items-center py-2 px-4 rounded-md gap-2 text-sm shadow-md bg-white">${validate_component(Filters_lines_svg, "FiltersLines").$$render($$result, { class: "h-4 w-4" }, {}, {})} Add filters</button> <label class="grid"><input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" type="search" id="search" name="search" placeholder="Search"></label></div> ${validate_component(SvelteTable, "SvelteTable").$$render(
    $$result,
    {
      classNameTable: "rolesTable",
      columns,
      rows
    },
    {},
    {}
  )}</div> ${modal ? `<form method="post" action="?/addEmployee"><div class="bg-black/70 fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center"><div class="bg-white rounded-xl p-8 w-[480px] grid gap-4 justify-items-stretch"><div data-svelte-h="svelte-1me5qfg"><p class="text-xl font-semibold">New Employee</p> <p class="text-sm text-subtitle pt-2">Register new employee here. Click save when you&#39;re done.</p></div> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1ooxtwg">Full Name</span> <input${spread(
    [
      { required: true },
      escape_object($constraints.userName),
      { name: "userName" },
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addEmployeeForm.userName, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1wyfy8p">Phone Number</span> <input${spread(
    [
      { required: true },
      escape_object($constraints.phoneNumber),
      { name: "phoneNumber" },
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addEmployeeForm.phoneNumber, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1qk1yd0">Email</span> <input${spread(
    [
      { required: true },
      escape_object($constraints.email),
      { name: "email" },
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addEmployeeForm.email, 0)}></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-qvhd28">Address</span> <input${spread(
    [
      { required: true },
      escape_object($constraints.address),
      { name: "address" },
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}${add_attribute("value", $addEmployeeForm.address, 0)}></label> <label><span class="text-primary font-medium" data-svelte-h="svelte-1fu522k">Role</span> <select${spread(
    [
      { required: true },
      escape_object($constraints.roleId),
      { name: "roleId" },
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}><option selected disabled value=" Select Role " data-svelte-h="svelte-ue44c7">Select Role </option>${each(data.roles, (role) => {
    return `<option${add_attribute("value", role.id, 0)}>${escape(role.name)} </option>`;
  })}</select></label> <label><span class="text-primary font-medium" data-svelte-h="svelte-mwpufp">Manager</span> <select${spread(
    [
      { required: true },
      escape_object($constraints.managerId),
      { name: "managerId" },
      {
        class: "mt-2 w-[420px] border-[1px] border-black/60 rounded-md p-2"
      }
    ],
    {}
  )}><option selected disabled value=" Select Manager " data-svelte-h="svelte-qfd8y0">Select Manager </option>${each(data.employees, (employee) => {
    return `<option${add_attribute("value", employee.User.id, 0)}>${escape(employee.User.userName)} </option>`;
  })}</select></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1aic0gs">Start Date</span> <input${spread(
    [
      { type: "date" },
      { name: "hiredDate" },
      {
        class: "w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2"
      },
      escape_object($constraints.hiredDate)
    ],
    {}
  )}${add_attribute("this", dateInput, 0)}${add_attribute("value", $addEmployeeForm.hiredDate, 0)}></label> <button class="bg-primary text-white rounded-md py-2" data-svelte-h="svelte-dlgw12">Save Employee</button></div></div></form>` : ``}`;
});
export {
  Page as default
};

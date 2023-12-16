import { c as create_ssr_component, b as subscribe, h as spread, j as escape_object, a as add_attribute, e as escape, f as each, v as validate_component } from "../../../../chunks/ssr.js";
import { s as superForm, d as dateProxy } from "../../../../chunks/index3.js";
import "../../../../chunks/index.js";
/* empty css                                                            */import "dayjs";
import { Q as QR } from "../../../../chunks/qr.js";
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $constraints, $$unsubscribe_constraints;
  let $editEmployeeForm, $$unsubscribe_editEmployeeForm;
  let $hireDate, $$unsubscribe_hireDate;
  let $birthDate, $$unsubscribe_birthDate;
  let { data } = $$props;
  const { form: editEmployeeForm, enhance: editFormEnhance, constraints } = superForm(data.editEmployeeForm);
  $$unsubscribe_editEmployeeForm = subscribe(editEmployeeForm, (value) => $editEmployeeForm = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  const hireDate = dateProxy(editEmployeeForm, "hiredDate", { format: "date", empty: "undefined" });
  $$unsubscribe_hireDate = subscribe(hireDate, (value) => $hireDate = value);
  const birthDate = dateProxy(editEmployeeForm, "dob", { format: "date", empty: "undefined" });
  $$unsubscribe_birthDate = subscribe(birthDate, (value) => $birthDate = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_constraints();
  $$unsubscribe_editEmployeeForm();
  $$unsubscribe_hireDate();
  $$unsubscribe_birthDate();
  return `<div class="p-6"><form method="post" action="?/editEmployeeInfo"><div class="flex justify-between"><div class="grid" data-svelte-h="svelte-1y0twd6"><p class="text-2xl">Employee Info</p> <p class="text-sm py-1 rounded-xl">Employee personal and performance details here.</p></div> <button class="bg-primary text-white rounded-md py-2 px-6" data-svelte-h="svelte-jna4gr">Update Info</button></div> <hr class="my-6"> <div class="grid gap-6 grid-cols-4"><label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-543wij">Full Name</span> <input${spread([{ name: "userName" }, escape_object($constraints.userName)], {})}${add_attribute("value", $editEmployeeForm.userName, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1pg26fk">Phone number</span> <input${spread([{ name: "phoneNumber" }, escape_object($constraints.phoneNumber)], {})}${add_attribute("value", $editEmployeeForm.phoneNumber, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-18a9vgl">Employment Type</span> <select${spread([{ name: "employmentType" }, escape_object($constraints.employmentType)], {})}><option selected disabled value="Select Employment Type" data-svelte-h="svelte-h4blhj">Select Employment Type</option><option value="FULL_TIME" data-svelte-h="svelte-1b44u7b">Full Time</option><option value="PART_TIME" data-svelte-h="svelte-1ls8gpb">Part Time</option><option value="TEMPORARY" data-svelte-h="svelte-fr7vg9">Contract</option></select></label> <div class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1v9y25u">Attendance</span> <div>${escape(data.employee.isAbsent ? "Absent" : data.employee.isSuspended ? "Suspended" : data.employee.isFired ? "Fired" : data.employee.onLeave ? "On Leave" : "Present")}</div></div> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1urgksf">Email</span> <input${spread([{ name: "email" }, escape_object($constraints.email)], {})}${add_attribute("value", $editEmployeeForm.email, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-xopvhj">Role</span> <select${spread([{ name: "roleId" }, escape_object($constraints.roleId)], {})}><option selected disabled value=" Select Role " data-svelte-h="svelte-ue44c7">Select Role </option>${each(data.roles, (role) => {
    return `<option${add_attribute("value", role.id, 0)}>${escape(role.name)} </option>`;
  })}</select></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-fnm66g">Date of Employment</span> <input type="date" name="hiredDate"${add_attribute("value", $hireDate, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-anuiv0">Manager</span> <select${spread([{ name: "managerId" }, escape_object($constraints.managerId)], {})}><option selected disabled value=" Select Role " data-svelte-h="svelte-ue44c7">Select Role </option>${each(data.allEmployees, (employee) => {
    return `<option${add_attribute("value", employee.User.id, 0)}>${escape(employee.User.userName)} </option>`;
  })}</select></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-1uz17v7">Date of Birth</span> <input type="date" name="dob"${add_attribute("value", $birthDate, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-15rcaf7">Blood Type</span> <input name="bloodType"${add_attribute("value", $editEmployeeForm.bloodType, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-o0f536">Height</span> <input name="height"${add_attribute("value", $editEmployeeForm.height, 0)}></label> <label class="grid flex-1"><span class="text-primary font-semibold py-1" data-svelte-h="svelte-ukj3ny">Job Title</span> <input name="jobTitle"${add_attribute("value", $editEmployeeForm.jobTitle, 0)}></label></div></form> <p class="text-2xl mt-10" data-svelte-h="svelte-fjvlo2">Documents</p> <hr class="my-6"> <div data-svelte-h="svelte-mclqao"><img${add_attribute("src", QR, 0)} alt="qr"></div> <p class="text-2xl mt-10" data-svelte-h="svelte-3o2v2v">Danger</p> <hr class="my-6"> <div class="border-2 border-danger border-dashed rounded-md p-5" data-svelte-h="svelte-gyn9m9"><div class="flex justify-between"><div><p class="text-lg">Suspend Employee</p> <p class="text-black/50">Suspend employee from job for a given time.</p></div> <button class="bg-danger text-white rounded-md py-2 px-6">Suspend</button></div> <div class="flex mt-6 justify-between"><div><p class="text-lg">Archive Employee</p> <p class="text-black/50">Archive employment contract with employee.</p></div> <button class="bg-danger text-white rounded-md py-2 px-6">Archive</button></div></div></div>`;
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
    $$rendered = `<div class="mx-10 my-12"><p class="text-sm mb-5">Employee / ${escape(data.employee?.User.userName)}</p>  <div class="flex rounded-md shadow-sm bg-ghost w-fit p-2 mb-6"><button><p class="${"py-2 px-3 rounded-md " + escape("bg-white", true)}">Info</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Attendance</p></button> <button><p class="${"p-2 px-3 rounded-md " + escape("", true)}">Leaves</p></button></div>  <div class="bg-white rounded-sm shadow-sm border-[1px] border-black/20">${`${validate_component(Info, "Info").$$render(
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

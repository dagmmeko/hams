import { c as create_ssr_component, b as subscribe, f as each, a as add_attribute, e as escape } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { data } = $$props;
  let selectedUnit;
  let selectedTenant;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  {
    {
      data.rentalUnits.find((unit) => unit.id === Number(selectedUnit));
    }
  }
  $$unsubscribe_page();
  return `<div class="mt-6 mx-10"><p class="text-xs text-black/50" data-svelte-h="svelte-eihya3">Tenants / Rent Room</p> <div class="bg-white p-6 mt-6 rounded-md shadow-sm border-[1px] border-black/20"><div class="" data-svelte-h="svelte-kwsvft"><p class="text-2xl font-medium">Rent Room</p> <p class="text-sm py-2">Find the tenant and select. Assign room and click save when you&#39;re done.</p></div> <div class="mt-6 grid grid-cols-2"><div><label class="grid gap-2" data-svelte-h="svelte-wbatuc"><span class="text-primary font-medium">Full Name</span> <input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" required name="fullName"></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-1gzbgv0">Tenant</span> <input placeholder="Search" class="w-[420px] border-[1px] mt-1 border-black/60 rounded-md p-2" type="search" id="search" name="search"></label></div> <div><label class="grid gap-2" data-svelte-h="svelte-wbatuc"><span class="text-primary font-medium">Full Name</span> <input class="w-[420px] border-[1px] border-black/60 rounded-md p-2" required name="fullName"></label> <label class="grid"><span class="text-primary font-medium" data-svelte-h="svelte-13bczdo">Available Units</span> <select required name="rentalUnitsId" class="w-[420px] mt-1 border-[1px] border-black/60 rounded-md p-2"><option selected disabled value=" Pick a Type " data-svelte-h="svelte-1aj00tp">Pick a Type </option>${each(data.rentalUnits, (unit) => {
    return `<option${add_attribute("value", unit.id, 0)}>${escape(unit.roomNumber)} </option>`;
  })}</select></label></div></div></div> <div class="grid grid-cols-2"><div>${data.tenants ? `${each(data.tenants, (tenant) => {
    return `<button><div class="${"" + escape(
      selectedTenant?.id === tenant.id ? "bg-primary/20 " : "bg-white",
      true
    ) + " grid text-start p-6 w-[444px] mt-6 rounded-md shadow-sm border-[1px] border-black/20"}"><div><span class="font-semibold" data-svelte-h="svelte-etco9t">Name:</span> ${escape(tenant.fullName)}</div> <div><span class="font-semibold" data-svelte-h="svelte-z1jqoe">Email:</span> ${escape(tenant.email)}</div> <div><span class="font-semibold" data-svelte-h="svelte-y4f3kq">Phone:</span> ${escape(tenant.phoneNumber)}</div> <div><span class="font-semibold" data-svelte-h="svelte-mon6o4">Score:</span> ${escape(tenant.tenantScore)}</div></div> </button>`;
  })}` : ``}</div> <div>${``}</div></div></div>`;
});
export {
  Page as default
};

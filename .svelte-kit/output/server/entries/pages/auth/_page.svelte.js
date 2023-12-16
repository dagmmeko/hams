import { c as create_ssr_component, v as validate_component, a as add_attribute } from "../../../chunks/ssr.js";
import { L as Logo_svg } from "../../../chunks/Logo.svg.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let email;
  let password;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="bg-ghost h-screen w-full grid items-center justify-center"><div class="bg-white p-6"><div class="grid justify-center mb-6">${validate_component(Logo_svg, "Logo").$$render($$result, {}, {}, {})}</div> <div data-svelte-h="svelte-vmxnto"><p class="text-xl font-semibold">Login</p> <p class="text-sm text-subtitle pt-2">Login to you company account</p></div> <form class="grid gap-6 mt-6"><label class="grid"><span data-svelte-h="svelte-1s7u0iy">Email</span> <input required class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2" name="email" type="email"${add_attribute("value", email, 0)}></label> <label class="grid"><span data-svelte-h="svelte-1pvl1h1">Password</span> <input required class="w-[420px] border-[1px] border-black/60 rounded-md p-2 mt-2" type="password" name="password"${add_attribute("value", password, 0)}></label> <button class="bg-primary w-full text-white rounded-md py-2" data-svelte-h="svelte-kz1w7r">Login</button></form></div></div>`;
});
export {
  Page as default
};

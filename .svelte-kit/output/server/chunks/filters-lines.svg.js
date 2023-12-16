import { c as create_ssr_component, a as add_attribute } from "./ssr.js";
const Filters_lines_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { color = "white" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg${add_attribute("class", className, 0)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Filters lines"><path id="Icon" d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="#344054" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;
});
export {
  Filters_lines_svg as F
};

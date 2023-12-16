import { n as noop, c as create_ssr_component, a as add_attribute, b as subscribe, v as validate_component, e as escape, d as assign, i as identity, o as onDestroy, m as missing_component, f as each, g as null_to_empty } from "../../chunks/ssr.js";
import { L as Logo_svg } from "../../chunks/Logo.svg.js";
import { p as page, n as navigating } from "../../chunks/stores.js";
import NProgress from "nprogress";
import { t as toast } from "../../chunks/SvelteToast.svelte_svelte_type_style_lang.js";
import { w as writable } from "../../chunks/index2.js";
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="h-16 bg-white w-full" data-svelte-h="svelte-12e3z5q">Header</div>`;
});
const Chart_pie_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.39244 5.01483C7.71836 3.95892 9.31549 3.29885 11 3.1106V13.0556H20.945C20.7567 14.7401 20.0967 16.3372 19.0408 17.6632C17.9849 18.9891 16.576 19.9899 14.9764 20.5505C13.3768 21.111 11.6514 21.2085 9.99877 20.8317C8.34618 20.4549 6.83357 19.6191 5.63502 18.4206C4.43648 17.222 3.60071 15.7094 3.22391 14.0568C2.84711 12.4042 2.9446 10.6788 3.50514 9.07922C4.06569 7.47959 5.06652 6.07075 6.39244 5.01483Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 9.0555H20.488C20.0391 7.79012 19.3135 6.64085 18.3641 5.69144C17.4147 4.74204 16.2654 4.01643 15 3.5675V9.0555Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const Employees = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 20.0555H22V18.0555C22 17.4321 21.8057 16.8241 21.4441 16.3162C21.0826 15.8082 20.5718 15.4255 19.9827 15.2213C19.3937 15.0171 18.7556 15.0014 18.1573 15.1766C17.5589 15.3517 17.03 15.7089 16.644 16.1985M17 20.0555H7M17 20.0555V18.0555C17 17.3995 16.874 16.7725 16.644 16.1985M16.644 16.1985C16.2726 15.2705 15.6318 14.475 14.804 13.9147C13.9762 13.3543 12.9996 13.0548 12 13.0548C11.0004 13.0548 10.0238 13.3543 9.196 13.9147C8.36825 14.475 7.72736 15.2705 7.356 16.1985M7 20.0555H2V18.0555C2.00005 17.4321 2.19434 16.8241 2.55586 16.3162C2.91739 15.8082 3.42819 15.4255 4.01725 15.2213C4.60632 15.0171 5.24438 15.0014 5.84274 15.1766C6.4411 15.3517 6.97003 15.7089 7.356 16.1985M7 20.0555V18.0555C7 17.3995 7.126 16.7725 7.356 16.1985M15 7.05554C15 7.85119 14.6839 8.61425 14.1213 9.17686C13.5587 9.73947 12.7956 10.0555 12 10.0555C11.2044 10.0555 10.4413 9.73947 9.87868 9.17686C9.31607 8.61425 9 7.85119 9 7.05554C9 6.25989 9.31607 5.49683 9.87868 4.93422C10.4413 4.37161 11.2044 4.05554 12 4.05554C12.7956 4.05554 13.5587 4.37161 14.1213 4.93422C14.6839 5.49683 15 6.25989 15 7.05554ZM21 10.0555C21 10.586 20.7893 11.0947 20.4142 11.4698C20.0391 11.8448 19.5304 12.0555 19 12.0555C18.4696 12.0555 17.9609 11.8448 17.5858 11.4698C17.2107 11.0947 17 10.586 17 10.0555C17 9.52511 17.2107 9.0164 17.5858 8.64133C17.9609 8.26626 18.4696 8.05554 19 8.05554C19.5304 8.05554 20.0391 8.26626 20.4142 8.64133C20.7893 9.0164 21 9.52511 21 10.0555ZM7 10.0555C7 10.586 6.78929 11.0947 6.41421 11.4698C6.03914 11.8448 5.53043 12.0555 5 12.0555C4.46957 12.0555 3.96086 11.8448 3.58579 11.4698C3.21071 11.0947 3 10.586 3 10.0555C3 9.52511 3.21071 9.0164 3.58579 8.64133C3.96086 8.26626 4.46957 8.05554 5 8.05554C5.53043 8.05554 6.03914 8.26626 6.41421 8.64133C6.78929 9.0164 7 9.52511 7 10.0555Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const Tenant_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 13.0555C14.7614 13.0555 17 10.817 17 8.05554C17 5.29412 14.7614 3.05554 12 3.05554C9.23858 3.05554 7 5.29412 7 8.05554C7 10.817 9.23858 13.0555 12 13.0555ZM12 13.0555C14.1217 13.0555 16.1566 13.8984 17.6569 15.3987C19.1571 16.899 20 18.9338 20 21.0555M12 13.0555C9.87827 13.0555 7.84344 13.8984 6.34315 15.3987C4.84285 16.899 4 18.9338 4 21.0555" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const Cash_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9.05554V7.05554C17 6.52511 16.7893 6.0164 16.4142 5.64133C16.0391 5.26626 15.5304 5.05554 15 5.05554H5C4.46957 5.05554 3.96086 5.26626 3.58579 5.64133C3.21071 6.0164 3 6.52511 3 7.05554V13.0555C3 13.586 3.21071 14.0947 3.58579 14.4698C3.96086 14.8448 4.46957 15.0555 5 15.0555H7M9 19.0555H19C19.5304 19.0555 20.0391 18.8448 20.4142 18.4698C20.7893 18.0947 21 17.586 21 17.0555V11.0555C21 10.5251 20.7893 10.0164 20.4142 9.64133C20.0391 9.26626 19.5304 9.05554 19 9.05554H9C8.46957 9.05554 7.96086 9.26626 7.58579 9.64133C7.21071 10.0164 7 10.5251 7 11.0555V17.0555C7 17.586 7.21071 18.0947 7.58579 18.4698C7.96086 18.8448 8.46957 19.0555 9 19.0555ZM16 14.0555C16 14.586 15.7893 15.0947 15.4142 15.4698C15.0391 15.8448 14.5304 16.0555 14 16.0555C13.4696 16.0555 12.9609 15.8448 12.5858 15.4698C12.2107 15.0947 12 14.586 12 14.0555C12 13.5251 12.2107 13.0164 12.5858 12.6413C12.9609 12.2663 13.4696 12.0555 14 12.0555C14.5304 12.0555 15.0391 12.2663 15.4142 12.6413C15.7893 13.0164 16 13.5251 16 14.0555Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const Store_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7.05554L6.41 2.64554C6.59606 2.45837 6.81732 2.30988 7.06103 2.20862C7.30474 2.10736 7.56609 2.05533 7.83 2.05554H16.17C16.4339 2.05533 16.6953 2.10736 16.939 2.20862C17.1827 2.30988 17.4039 2.45837 17.59 2.64554L22 7.05554M2 7.05554H22M2 7.05554V10.0555C2 10.586 2.21071 11.0947 2.58579 11.4698C2.96086 11.8448 3.46957 12.0555 4 12.0555M22 7.05554V10.0555C22 10.586 21.7893 11.0947 21.4142 11.4698C21.0391 11.8448 20.5304 12.0555 20 12.0555M4 12.0555V20.0555C4 20.586 4.21071 21.0947 4.58579 21.4698C4.96086 21.8448 5.46957 22.0555 6 22.0555H18C18.5304 22.0555 19.0391 21.8448 19.4142 21.4698C19.7893 21.0947 20 20.586 20 20.0555V12.0555M4 12.0555C4.58426 12.0234 5.14227 11.8023 5.59 11.4255C5.70932 11.3393 5.85279 11.2929 6 11.2929C6.14721 11.2929 6.29068 11.3393 6.41 11.4255C6.85773 11.8023 7.41574 12.0234 8 12.0555C8.58426 12.0234 9.14227 11.8023 9.59 11.4255C9.70932 11.3393 9.85279 11.2929 10 11.2929C10.1472 11.2929 10.2907 11.3393 10.41 11.4255C10.8577 11.8023 11.4157 12.0234 12 12.0555C12.5843 12.0234 13.1423 11.8023 13.59 11.4255C13.7093 11.3393 13.8528 11.2929 14 11.2929C14.1472 11.2929 14.2907 11.3393 14.41 11.4255C14.8577 11.8023 15.4157 12.0234 16 12.0555C16.5843 12.0234 17.1423 11.8023 17.59 11.4255C17.7093 11.3393 17.8528 11.2929 18 11.2929C18.1472 11.2929 18.2907 11.3393 18.41 11.4255C18.8577 11.8023 19.4157 12.0234 20 12.0555M15 22.0555V18.0555C15 17.5251 14.7893 17.0164 14.4142 16.6413C14.0391 16.2663 13.5304 16.0555 13 16.0555H11C10.4696 16.0555 9.96086 16.2663 9.58579 16.6413C9.21071 17.0164 9 17.5251 9 18.0555V22.0555" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const Webhook_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 17.0355H12.01C10.91 17.0355 10.06 17.9755 9.53 18.9355C9.11045 19.7228 8.43979 20.3472 7.62462 20.7095C6.80945 21.0718 5.89656 21.1513 5.03107 20.9352C4.16558 20.7191 3.39715 20.2199 2.84795 19.5169C2.29874 18.814 2.00028 17.9476 2 17.0555C2.01 16.3555 2.2 15.6555 2.57 15.0555M6 17.0556L9.13 11.2756C9.66 10.3056 9.23 9.0956 8.63 8.1756C8.34681 7.7227 8.15721 7.21767 8.07236 6.69031C7.98751 6.16295 8.00915 5.62393 8.13599 5.10507C8.26283 4.5862 8.49231 4.09799 8.81088 3.66925C9.12946 3.24051 9.53068 2.87991 9.99087 2.60874C10.4511 2.33757 10.9609 2.16131 11.4903 2.09037C12.0197 2.01943 12.558 2.05524 13.0733 2.19568C13.5887 2.33613 14.0707 2.57838 14.4909 2.90812C14.9111 3.23787 15.261 3.64843 15.52 4.1156M12 6.05554L15.13 11.7855C15.66 12.7555 16.9 13.0555 18 13.0555C19.0609 13.0555 20.0783 13.477 20.8284 14.2271C21.5786 14.9773 22 15.9947 22 17.0555C22 18.1164 21.5786 19.1338 20.8284 19.884C20.0783 20.6341 19.0609 21.0555 18 21.0555" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const Home_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<svg${add_attribute("class", className, 0)} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 22.0555V12.0555H15V22.0555M3 9.05554L12 2.05554L21 9.05554V20.0555C21 20.586 20.7893 21.0947 20.4142 21.4698C20.0391 21.8448 19.5304 22.0555 19 22.0555H5C4.46957 22.0555 3.96086 21.8448 3.58579 21.4698C3.21071 21.0947 3 20.586 3 20.0555V9.05554Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const Side_nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<div class="h-screen bg-black w-60 px-4">${validate_component(Logo_svg, "Logo").$$render($$result, { class: "h-16 w-16" }, {}, {})} <div class="grid gap-3"><a href="/"><div class="${"text-white flex gap-2 m-2 " + escape(
    $page.url.pathname === "/" ? "bg-primary rounded-md p-1" : "",
    true
  )}">${validate_component(Chart_pie_svg, "ChartPie").$$render($$result, {}, {}, {})} OverView</div></a> <a href="/rental-units"><div class="${"text-white flex gap-2 m-2 " + escape(
    $page.url.pathname === "/rental-units" ? "bg-primary rounded-md p-1" : "",
    true
  )}">${validate_component(Home_svg, "Home").$$render($$result, {}, {}, {})} Rental Units</div></a> <a href="/tenants"><div class="${"text-white flex gap-2 m-2 " + escape(
    $page.url.pathname === "/tenants" ? "bg-primary rounded-md p-1" : "",
    true
  )}">${validate_component(Tenant_svg, "Tenant").$$render($$result, {}, {}, {})} Tenant</div></a> <a href="/employees"><div class="${"text-white flex gap-2 m-2 " + escape(
    $page.url.pathname === "/employees" ? "bg-primary rounded-md p-1" : "",
    true
  )}">${validate_component(Employees, "Employees").$$render($$result, {}, {}, {})} Employees</div></a> <a href="/accounting"><div class="${"text-white flex gap-2 m-2 " + escape(
    $page.url.pathname === "/accounting" ? "bg-primary rounded-md p-1" : "",
    true
  )}">${validate_component(Cash_svg, "Cash").$$render($$result, {}, {}, {})} Accounting</div></a> <a href="/vendor-task"><div class="${"text-white flex gap-2 m-2 " + escape(
    $page.url.pathname === "/vendor-task" ? "bg-primary rounded-md p-1" : "",
    true
  )}">${validate_component(Store_svg, "Store").$$render($$result, {}, {}, {})} Vendor &amp; Task</div></a> <a href="/roles"><div class="${"text-white flex gap-2 m-2 " + escape(
    $page.url.pathname === "/roles" ? "bg-primary rounded-md p-1" : "",
    true
  )}">${validate_component(Webhook_svg, "Webhook").$$render($$result, {}, {}, {})} Role</div></a></div></div>`;
});
const nprogress = "";
const nprogress_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "#nprogress .bar{height:0.5rem;--tw-bg-opacity:1;background-color:rgb(11 102 106 / var(--tw-bg-opacity))\n}#nprogress .bar .peg{display:none\n}",
  map: null
};
const delay = 250;
const Nprogress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  let timer = null;
  let state = null;
  function load() {
    if (state === "loading") {
      return;
    }
    state = "loading";
    timer = setTimeout(
      function() {
        NProgress.start();
      },
      delay
    );
  }
  function stop() {
    state = "stop";
    if (timer) {
      clearTimeout(timer);
    }
    NProgress.done();
  }
  $$result.css.add(css$2);
  {
    {
      if ($navigating) {
        load();
      } else {
        stop();
      }
    }
  }
  $$unsubscribe_navigating();
  return ``;
});
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay: delay2 = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay2;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const css$1 = {
  code: "._toastItem.svelte-95rq8t{width:var(--toastWidth, 16rem);height:var(--toastHeight, auto);min-height:var(--toastMinHeight, 3.5rem);margin:var(--toastMargin, 0 0 0.5rem 0);padding:var(--toastPadding, 0);background:var(--toastBackground, rgba(66, 66, 66, 0.9));color:var(--toastColor, #fff);box-shadow:var(\n    --toastBoxShadow,\n    0 4px 6px -1px rgba(0, 0, 0, 0.1),\n    0 2px 4px -1px rgba(0, 0, 0, 0.06)\n  );border:var(--toastBorder, none);border-radius:var(--toastBorderRadius, 0.125rem);position:relative;display:flex;flex-direction:row;align-items:center;overflow:hidden;will-change:transform, opacity;-webkit-tap-highlight-color:transparent}._toastMsg.svelte-95rq8t{padding:var(--toastMsgPadding, 0.75rem 0.5rem);flex:1 1 0%}.pe.svelte-95rq8t,._toastMsg.svelte-95rq8t a{pointer-events:auto}._toastBtn.svelte-95rq8t{width:var(--toastBtnWidth, 2rem);height:var(--toastBtnHeight, 100%);cursor:pointer;outline:none}._toastBtn.svelte-95rq8t::after{content:var(--toastBtnContent, '✕');font:var(--toastBtnFont, 1rem sans-serif);display:flex;align-items:center;justify-content:center}._toastBar.svelte-95rq8t{top:var(--toastBarTop, auto);right:var(--toastBarRight, auto);bottom:var(--toastBarBottom, 0);left:var(--toastBarLeft, 0);height:var(--toastBarHeight, 6px);width:var(--toastBarWidth, 100%);position:absolute;display:block;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;background:transparent;pointer-events:none}._toastBar.svelte-95rq8t::-webkit-progress-bar{background:transparent}._toastBar.svelte-95rq8t::-webkit-progress-value{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}._toastBar.svelte-95rq8t::-moz-progress-bar{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}",
  map: null
};
function check(prop, kind = "undefined") {
  return typeof prop === kind;
}
const ToastItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $progress, $$unsubscribe_progress;
  let { item } = $$props;
  let next = item.initial;
  let cprops = {};
  const progress = tweened(item.initial, { duration: item.duration, easing: identity });
  $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
  function close() {
    toast.pop(item.id);
  }
  function autoclose() {
    if ($progress === 1 || $progress === 0)
      close();
  }
  onDestroy(() => {
    if (check(item.onpop, "function")) {
      item.onpop(item.id);
    }
  });
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  $$result.css.add(css$1);
  {
    if (!check(item.progress)) {
      item.next = item.progress;
    }
  }
  {
    if (next !== item.next) {
      next = item.next;
      progress.set(next).then(autoclose);
    }
  }
  {
    if (item.component) {
      const { props = {}, sendIdTo } = item.component;
      cprops = {
        ...props,
        ...sendIdTo && { [sendIdTo]: item.id }
      };
    }
  }
  $$unsubscribe_progress();
  return `<div role="status" class="${["_toastItem svelte-95rq8t", item.pausable ? "pe" : ""].join(" ").trim()}"><div class="${["_toastMsg svelte-95rq8t", item.component ? "pe" : ""].join(" ").trim()}">${item.component ? `${validate_component(item.component.src || missing_component, "svelte:component").$$render($$result, Object.assign({}, cprops), {}, {})}` : `<!-- HTML_TAG_START -->${item.msg}<!-- HTML_TAG_END -->`}</div> ${item.dismissable ? `<div class="_toastBtn pe svelte-95rq8t" role="button" tabindex="0"></div>` : ``} <progress class="_toastBar svelte-95rq8t"${add_attribute("value", $progress, 0)}></progress> </div>`;
});
const css = {
  code: "._toastContainer.svelte-1u812xz{top:var(--toastContainerTop, 1.5rem);right:var(--toastContainerRight, 2rem);bottom:var(--toastContainerBottom, auto);left:var(--toastContainerLeft, auto);position:fixed;margin:0;padding:0;list-style-type:none;pointer-events:none;z-index:var(--toastContainerZIndex, 9999)}",
  map: null
};
function getCss(theme) {
  return theme ? Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, "") : void 0;
}
const SvelteToast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toast, $$unsubscribe_toast;
  $$unsubscribe_toast = subscribe(toast, (value) => $toast = value);
  let { options = {} } = $$props;
  let { target = "default" } = $$props;
  let items = [];
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  $$result.css.add(css);
  {
    toast._init(target, options);
  }
  items = $toast.filter((i) => i.target === target);
  $$unsubscribe_toast();
  return `<ul class="_toastContainer svelte-1u812xz">${each(items, (item) => {
    return `<li class="${escape(null_to_empty(item.classes?.join(" ")), true) + " svelte-1u812xz"}"${add_attribute("style", getCss(item.theme), 0)}>${validate_component(ToastItem, "ToastItem").$$render($$result, { item }, {}, {})} </li>`;
  })} </ul>`;
});
const app = "";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div>${data.session === null ? `${slots.default ? slots.default({}) : ``}` : `<div class="flex relative h-screen bg-ghost/60 shadow-md">${validate_component(Side_nav, "SideNav").$$render($$result, {}, {}, {})} <div class="w-full h-full overflow-auto">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}</div></div>`}</div> ${validate_component(SvelteToast, "SvelteToast").$$render($$result, {}, {}, {})} ${validate_component(Nprogress, "Nprogress").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};

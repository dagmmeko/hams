function n(c,t){const e=i=>{c.contains(i.target)||t==null||t()};return document.addEventListener("click",e,!0),{destroy(){document.removeEventListener("click",e,!0)}}}export{n as c};

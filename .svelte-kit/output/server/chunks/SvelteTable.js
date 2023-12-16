import { c as create_ssr_component, t as createEventDispatcher, e as escape, g as null_to_empty, f as each, a as add_attribute, v as validate_component, m as missing_component } from "./ssr.js";
/* empty css                                           */const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
const { Object: Object_1 } = globals;
const css = {
  code: "table.svelte-dsaf7t.svelte-dsaf7t{width:100%}.isSortable.svelte-dsaf7t.svelte-dsaf7t{cursor:pointer}.isClickable.svelte-dsaf7t.svelte-dsaf7t{cursor:pointer}tr.svelte-dsaf7t th select.svelte-dsaf7t{width:100%}",
  map: null
};
const SvelteTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let colspan;
  let { columns } = $$props;
  let { rows } = $$props;
  let { c_rows = void 0 } = $$props;
  let { sortOrders = [1, -1] } = $$props;
  let { sortBy = "" } = $$props;
  let { sortOrder = sortOrders?.[0] || 1 } = $$props;
  let { filterSelections = {} } = $$props;
  let { expanded = [] } = $$props;
  let { selected = [] } = $$props;
  let { expandRowKey = null } = $$props;
  let { rowKey = expandRowKey } = $$props;
  let { expandSingle = false } = $$props;
  let { selectSingle = false } = $$props;
  let { selectOnClick = false } = $$props;
  let { iconAsc = "▲" } = $$props;
  let { iconDesc = "▼" } = $$props;
  let { iconSortable = "" } = $$props;
  let { iconExpand = "▼" } = $$props;
  let { iconExpanded = "▲" } = $$props;
  let { showExpandIcon = false } = $$props;
  let { classNameTable = "" } = $$props;
  let { classNameThead = "" } = $$props;
  let { classNameTbody = "" } = $$props;
  let { classNameSelect = "" } = $$props;
  let { classNameInput = "" } = $$props;
  let { classNameRow = null } = $$props;
  let { classNameCell = "" } = $$props;
  let { classNameRowSelected = null } = $$props;
  let { classNameRowExpanded = null } = $$props;
  let { classNameExpandedContent = "" } = $$props;
  let { classNameCellExpand = "" } = $$props;
  createEventDispatcher();
  let sortFunction = () => "";
  if (!Array.isArray(expanded))
    throw "'expanded' needs to be an array";
  if (!Array.isArray(selected))
    throw "'selection' needs to be an array";
  if (expandRowKey !== null) {
    console.warn("'expandRowKey' is deprecated in favour of 'rowKey'");
  }
  if (classNameRowSelected && !rowKey) {
    console.error("'rowKey' is needed to use 'classNameRowSelected'");
  }
  let showFilterHeader = columns.some((c) => {
    return !c.hideFilterHeader && (c.filterOptions !== void 0 || c.searchValue !== void 0);
  });
  let filterValues = {};
  let columnByKey;
  const asStringArray = (v) => [].concat(v).filter((v2) => v2 !== null && typeof v2 === "string" && v2 !== "").join(" ");
  const calculateFilterValues = () => {
    filterValues = {};
    columns.forEach((c) => {
      if (typeof c.filterOptions === "function") {
        filterValues[c.key] = c.filterOptions(rows);
      } else if (Array.isArray(c.filterOptions)) {
        filterValues[c.key] = c.filterOptions.map((val) => ({ name: val, value: val }));
      }
    });
  };
  if ($$props.columns === void 0 && $$bindings.columns && columns !== void 0)
    $$bindings.columns(columns);
  if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
    $$bindings.rows(rows);
  if ($$props.c_rows === void 0 && $$bindings.c_rows && c_rows !== void 0)
    $$bindings.c_rows(c_rows);
  if ($$props.sortOrders === void 0 && $$bindings.sortOrders && sortOrders !== void 0)
    $$bindings.sortOrders(sortOrders);
  if ($$props.sortBy === void 0 && $$bindings.sortBy && sortBy !== void 0)
    $$bindings.sortBy(sortBy);
  if ($$props.sortOrder === void 0 && $$bindings.sortOrder && sortOrder !== void 0)
    $$bindings.sortOrder(sortOrder);
  if ($$props.filterSelections === void 0 && $$bindings.filterSelections && filterSelections !== void 0)
    $$bindings.filterSelections(filterSelections);
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded !== void 0)
    $$bindings.expanded(expanded);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.expandRowKey === void 0 && $$bindings.expandRowKey && expandRowKey !== void 0)
    $$bindings.expandRowKey(expandRowKey);
  if ($$props.rowKey === void 0 && $$bindings.rowKey && rowKey !== void 0)
    $$bindings.rowKey(rowKey);
  if ($$props.expandSingle === void 0 && $$bindings.expandSingle && expandSingle !== void 0)
    $$bindings.expandSingle(expandSingle);
  if ($$props.selectSingle === void 0 && $$bindings.selectSingle && selectSingle !== void 0)
    $$bindings.selectSingle(selectSingle);
  if ($$props.selectOnClick === void 0 && $$bindings.selectOnClick && selectOnClick !== void 0)
    $$bindings.selectOnClick(selectOnClick);
  if ($$props.iconAsc === void 0 && $$bindings.iconAsc && iconAsc !== void 0)
    $$bindings.iconAsc(iconAsc);
  if ($$props.iconDesc === void 0 && $$bindings.iconDesc && iconDesc !== void 0)
    $$bindings.iconDesc(iconDesc);
  if ($$props.iconSortable === void 0 && $$bindings.iconSortable && iconSortable !== void 0)
    $$bindings.iconSortable(iconSortable);
  if ($$props.iconExpand === void 0 && $$bindings.iconExpand && iconExpand !== void 0)
    $$bindings.iconExpand(iconExpand);
  if ($$props.iconExpanded === void 0 && $$bindings.iconExpanded && iconExpanded !== void 0)
    $$bindings.iconExpanded(iconExpanded);
  if ($$props.showExpandIcon === void 0 && $$bindings.showExpandIcon && showExpandIcon !== void 0)
    $$bindings.showExpandIcon(showExpandIcon);
  if ($$props.classNameTable === void 0 && $$bindings.classNameTable && classNameTable !== void 0)
    $$bindings.classNameTable(classNameTable);
  if ($$props.classNameThead === void 0 && $$bindings.classNameThead && classNameThead !== void 0)
    $$bindings.classNameThead(classNameThead);
  if ($$props.classNameTbody === void 0 && $$bindings.classNameTbody && classNameTbody !== void 0)
    $$bindings.classNameTbody(classNameTbody);
  if ($$props.classNameSelect === void 0 && $$bindings.classNameSelect && classNameSelect !== void 0)
    $$bindings.classNameSelect(classNameSelect);
  if ($$props.classNameInput === void 0 && $$bindings.classNameInput && classNameInput !== void 0)
    $$bindings.classNameInput(classNameInput);
  if ($$props.classNameRow === void 0 && $$bindings.classNameRow && classNameRow !== void 0)
    $$bindings.classNameRow(classNameRow);
  if ($$props.classNameCell === void 0 && $$bindings.classNameCell && classNameCell !== void 0)
    $$bindings.classNameCell(classNameCell);
  if ($$props.classNameRowSelected === void 0 && $$bindings.classNameRowSelected && classNameRowSelected !== void 0)
    $$bindings.classNameRowSelected(classNameRowSelected);
  if ($$props.classNameRowExpanded === void 0 && $$bindings.classNameRowExpanded && classNameRowExpanded !== void 0)
    $$bindings.classNameRowExpanded(classNameRowExpanded);
  if ($$props.classNameExpandedContent === void 0 && $$bindings.classNameExpandedContent && classNameExpandedContent !== void 0)
    $$bindings.classNameExpandedContent(classNameExpandedContent);
  if ($$props.classNameCellExpand === void 0 && $$bindings.classNameCellExpand && classNameCellExpand !== void 0)
    $$bindings.classNameCellExpand(classNameCellExpand);
  $$result.css.add(css);
  {
    {
      columnByKey = {};
      columns.forEach((col) => {
        columnByKey[col.key] = col;
      });
    }
  }
  colspan = (showExpandIcon ? 1 : 0) + columns.length;
  {
    {
      let col = columnByKey[sortBy];
      if (col !== void 0 && col.sortable === true && typeof col.value === "function") {
        sortFunction = (r) => col.value(r);
      }
    }
  }
  c_rows = rows.filter((r) => {
    return Object.keys(filterSelections).every((f) => {
      let resSearch = null;
      if (columnByKey[f] === void 0) {
        return true;
      } else if (!columnByKey[f]?.searchValue) {
        resSearch = false;
      } else if (filterSelections[f] === "") {
        return true;
      } else if (columnByKey[f].searchValue.length === 1) {
        resSearch = (columnByKey[f].searchValue(r) + "").toLocaleLowerCase().indexOf((filterSelections[f] + "").toLocaleLowerCase()) >= 0;
      } else if (columnByKey[f].searchValue.length === 2) {
        resSearch = !!columnByKey[f].searchValue(r, filterSelections[f] + "");
      }
      let resFilter = resSearch || filterSelections[f] === void 0 || // default to value() if filterValue() not provided in col
      filterSelections[f] === (typeof columnByKey[f].filterValue === "function" ? columnByKey[f].filterValue(r) : columnByKey[f].value(r));
      return resFilter;
    });
  }).map((r) => Object.assign({}, r, {
    // internal row property for sort order
    $sortOn: sortFunction(r),
    // internal row property for expanded rows
    $expanded: rowKey !== null && expanded.indexOf(r[rowKey]) >= 0,
    $selected: rowKey !== null && selected.indexOf(r[rowKey]) >= 0
  })).sort((a, b) => {
    if (!sortBy)
      return 0;
    else if (a.$sortOn > b.$sortOn)
      return sortOrder;
    else if (a.$sortOn < b.$sortOn)
      return -sortOrder;
    return 0;
  });
  {
    {
      if (showFilterHeader && columns && rows) {
        calculateFilterValues();
      }
    }
  }
  return `<table class="${escape(null_to_empty(asStringArray(classNameTable)), true) + " svelte-dsaf7t"}"><thead class="${escape(null_to_empty(asStringArray(classNameThead)), true) + " svelte-dsaf7t"}">${showFilterHeader ? `<tr class="svelte-dsaf7t">${each(columns, (col) => {
    return `<th class="${escape(null_to_empty(asStringArray([col.headerFilterClass])), true) + " svelte-dsaf7t"}">${!col.hideFilterHeader && col.searchValue !== void 0 ? `<input class="${escape(null_to_empty(asStringArray(classNameInput)), true) + " svelte-dsaf7t"}"${add_attribute("placeholder", col.filterPlaceholder, 0)}${add_attribute("value", filterSelections[col.key], 0)}>` : `${!col.hideFilterHeader && filterValues[col.key] !== void 0 ? `<select class="${escape(null_to_empty(asStringArray(classNameSelect)), true) + " svelte-dsaf7t"}"><option${add_attribute("value", void 0, 0)}>${escape(col.filterPlaceholder || "")}</option>${each(filterValues[col.key], (option) => {
      return `<option${add_attribute("value", option.value, 0)}>${escape(option.name)}</option>`;
    })}</select>` : ``}`} </th>`;
  })} ${showExpandIcon ? `<th></th>` : ``}</tr>` : ``} ${slots.header ? slots.header({ sortOrder, sortBy }) : ` <tr>${each(columns, (col) => {
    return `<th class="${escape(null_to_empty(asStringArray([col.sortable ? "isSortable" : "", col.headerClass])), true) + " svelte-dsaf7t"}" tabindex="0">${escape(col.title)} ${sortBy === col.key ? `<!-- HTML_TAG_START -->${sortOrder === 1 ? iconAsc : iconDesc}<!-- HTML_TAG_END -->` : `${col.sortable ? `<!-- HTML_TAG_START -->${iconSortable}<!-- HTML_TAG_END -->` : ``}`} </th>`;
  })} ${showExpandIcon ? `<th></th>` : ``}</tr> `}</thead> <tbody class="${escape(null_to_empty(asStringArray(classNameTbody)), true) + " svelte-dsaf7t"}">${each(c_rows, (row, n) => {
    return `${slots.row ? slots.row({ row, n }) : ` <tr class="${escape(
      null_to_empty(asStringArray([
        typeof classNameRow === "string" ? classNameRow : null,
        typeof classNameRow === "function" ? classNameRow(row, n) : null,
        row.$expanded && classNameRowExpanded,
        row.$selected && classNameRowSelected
      ])),
      true
    ) + " svelte-dsaf7t"}"${add_attribute("tabindex", selectOnClick ? "0" : null, 0)}>${each(columns, (col, colIndex) => {
      return `<td class="${escape(
        null_to_empty(asStringArray([
          typeof col.class === "string" ? col.class : null,
          typeof col.class === "function" ? col.class(row, n, colIndex) : null,
          classNameCell
        ])),
        true
      ) + " svelte-dsaf7t"}">${col.renderComponent ? `${validate_component(col.renderComponent.component || col.renderComponent || missing_component, "svelte:component").$$render($$result, Object_1.assign({}, col.renderComponent.props || {}, { row }, { col }), {}, {})}` : `${col.parseHTML ? `<!-- HTML_TAG_START -->${col.renderValue ? col.renderValue(row, n, colIndex) : col.value(row, n, colIndex)}<!-- HTML_TAG_END -->` : `${escape(col.renderValue ? col.renderValue(row, n, colIndex) : col.value(row, n, colIndex))}`}`} </td>`;
    })} ${showExpandIcon ? `<td class="${escape(null_to_empty(asStringArray(classNameCellExpand)), true) + " svelte-dsaf7t"}"><span class="isClickable svelte-dsaf7t" tabindex="0" role="button"><!-- HTML_TAG_START -->${row.$expanded ? iconExpand : iconExpanded}<!-- HTML_TAG_END --></span> </td>` : ``}</tr> ${row.$expanded ? `<tr class="${escape(null_to_empty(asStringArray(classNameExpandedContent)), true) + " svelte-dsaf7t"}"><td${add_attribute("colspan", colspan, 0)}>${slots.expanded ? slots.expanded({ row, n }) : ``} </td></tr>` : ``} `}`;
  })}</tbody> </table>`;
});
export {
  SvelteTable as S
};

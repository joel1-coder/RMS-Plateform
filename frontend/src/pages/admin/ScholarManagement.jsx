import React, { useMemo, useState, useEffect, useRef } from "react";
import './ScholarManagement.css';

const ROMAN_DC = ["I", "II", "III"];
const ROMAN_EXT = ["I", "II"];
const ROMAN_YEARS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const COLUMNS = [
  { key: "sNo", label: "S.No", group: null, type: "number", width: 50, sticky: true },
  { key: "department", label: "Department", group: null, type: "select", width: 130, sticky: true, options: ["Biotechnology", "Chemistry", "Physics", "Computer Science", "Zoology", "Botany"] },
  { key: "guideName", label: "Guide Name", group: null, type: "text", width: 140, sticky: true },
  { key: "scholarName", label: "Name of the Scholar", group: null, type: "text", width: 170, sticky: true },
  { key: "regNo", label: "Reg. No.", group: null, type: "text", width: 100 },
  { key: "gender", label: "Gender", group: null, type: "select", width: 80, options: ["Male", "Female", "Other"] },
  { key: "fullPartTime", label: "Full / Part Time", group: null, type: "select", width: 100, options: ["Full Time", "Part Time"] },
  { key: "residentialAddress", label: "Residential Address", group: null, type: "text", width: 240 },
  { key: "nationalityState", label: "Nationality & State", group: null, type: "text", width: 140 },
  { key: "religionCommunity", label: "Religion & Community", group: null, type: "text", width: 140 },
  { key: "dateOfBirth", label: "Date of Birth", group: null, type: "date", width: 110 },
  { key: "mobileNo", label: "Mobile No.", group: null, type: "text", width: 110 },
  { key: "universityRefNoWithYear", label: "University Ref. No. with Year of admission", group: null, type: "text", width: 210 },
  ...ROMAN_DC.map((r) => ({ key: `dateOfDcMeeting.${r}`, parentKey: "dateOfDcMeeting", subKey: r, label: r, group: "Date of DC meeting", type: "date", width: 95 })),
  ...ROMAN_EXT.map((r) => ({ key: `extension.${r}`, parentKey: "extension", subKey: r, label: r, group: "Extension", type: "dateOrMonths", width: 95 })),
  ...ROMAN_YEARS.map((r) => ({ key: `feesPaymentDates.${r}`, parentKey: "feesPaymentDates", subKey: r, label: r, group: "Date of Fees Payment", type: "date", width: 95 })),
  { key: "synopsisSubmittedOn", label: "Synopsis Submitted on", group: null, type: "date", width: 125 },
  { key: "publicVivaOn", label: "Public Viva Voce on", group: null, type: "date", width: 125 },
  { key: "remarks", label: "Remarks", group: null, type: "text", width: 170 },
];

function getGroupedHeaderRows(columns) {
  const topRow = [];
  const bottomRow = [];
  let i = 0;
  while (i < columns.length) {
    const col = columns[i];
    if (col.group) {
      let span = 0, j = i;
      while (j < columns.length && columns[j].group === col.group) {
        bottomRow.push({ label: columns[j].label, colKey: columns[j].key });
        span++; j++;
      }
      topRow.push({ label: col.group, span, key: col.group });
      i = j;
    } else {
      topRow.push({ label: col.label, span: 1, key: col.key, single: true });
      bottomRow.push({ label: "", colKey: col.key, blank: true });
      i++;
    }
  }
  return { topRow, bottomRow };
}

function computeStickyOffsets(columns) {
  const offsets = {};
  let running = 0;
  for (const col of columns) {
    if (col.sticky) { offsets[col.key] = running; running += col.width; }
  }
  return offsets;
}

function getValue(row, key) {
  if (!key.includes(".")) return row[key];
  const [p, s] = key.split(".");
  return (row[p] && row[p][s]) || "";
}
function setValue(row, key, value) {
  const next = { ...row };
  if (!key.includes(".")) { next[key] = value; }
  else { const [p, s] = key.split("."); next[p] = { ...next[p], [s]: value }; }
  return next;
}

const seed = [
  {
    sNo: 1, department: "Biotechnology", guideName: "Dr. A. Edward", scholarName: "Tisha Liza Tomy",
    regNo: "2018BT101", gender: "Female", fullPartTime: "Part Time",
    residentialAddress: "Nagercoil Villa House, Aranattukara - Eithuruth Road, Near Pipe Bus Stop, Laloor, Kerala - 680011",
    nationalityState: "Indian, Kerala", religionCommunity: "RC & OC", dateOfBirth: "1988-12-04",
    mobileNo: "9539722214", universityRefNoWithYear: "BDU/2103737/9371 & 26/08/2021",
    dateOfDcMeeting: { I: "2022-01-14", II: "", III: "" }, extension: { I: "", II: "" },
    feesPaymentDates: { I: "2022-01-09", II: "2022-10-28", III: "2023-11-01", IV: "", V: "", VI: "", VII: "", VIII: "" },
    synopsisSubmittedOn: "", publicVivaOn: "", remarks: "",
  },
  { sNo: 2, department: "Biotechnology", guideName: "Dr. A. Edward", scholarName: "", regNo: "", gender: "", fullPartTime: "", residentialAddress: "", nationalityState: "", religionCommunity: "", dateOfBirth: "", mobileNo: "", universityRefNoWithYear: "", dateOfDcMeeting: { I: "", II: "", III: "" }, extension: { I: "", II: "" }, feesPaymentDates: { I: "", II: "", III: "", IV: "", V: "", VI: "", VII: "", VIII: "" }, synopsisSubmittedOn: "", publicVivaOn: "", remarks: "" },
  { sNo: 3, department: "Biotechnology", guideName: "Dr. A. Edward", scholarName: "", regNo: "", gender: "", fullPartTime: "", residentialAddress: "", nationalityState: "", religionCommunity: "", dateOfBirth: "", mobileNo: "", universityRefNoWithYear: "", dateOfDcMeeting: { I: "", II: "", III: "" }, extension: { I: "", II: "" }, feesPaymentDates: { I: "", II: "", III: "", IV: "", V: "", VI: "", VII: "", VIII: "" }, synopsisSubmittedOn: "", publicVivaOn: "", remarks: "" },
];

function EditableCell({ row, col, isEditing, onStartEdit, onCancel, onCommit }) {
  const value = getValue(row, col.key);
  const [draft, setDraft] = useState(value ?? "");
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value ?? ""); }, [value, isEditing]);
  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  const commit = (v) => onCommit(col.key, v);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") commit(draft);
    else if (e.key === "Escape") onCancel();
  };

  if (!isEditing) {
    if (col.type === "date" && value) {
      return (
        <div onDoubleClick={onStartEdit} className="editable-date">
          <span className={`dot ${col.group === "Date of Fees Payment" ? "dot-green" : "dot-gray"}`} />
          <span>{value}</span>
        </div>
      );
    }
    if (col.group === "Date of Fees Payment" && !value) {
      return (
        <div onDoubleClick={onStartEdit} className="editable-date">
          <span className="dot dot-red" />
          <span className="text-red">Pending</span>
        </div>
      );
    }
    return (
      <div onDoubleClick={onStartEdit} className="editable-cell-wrapper" title={value || "Double-click to edit"}>
        {value || <span style={{ color: "#cbd5e1" }}>—</span>}
      </div>
    );
  }

  const common = {
    ref: inputRef, value: draft, onChange: (e) => setDraft(e.target.value),
    onKeyDown: handleKeyDown, onBlur: () => commit(draft),
    className: "editable-input",
  };

  if (col.type === "select") {
    return (
      <select {...common}>
        <option value="">—</option>
        {col.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (col.type === "date") return <input type="date" {...common} />;
  if (col.type === "dateOrMonths") {
    return (
      <div className="flex-inputs">
        <input type="date" {...common} />
        <input type="number" placeholder="mo." value={draft && isNaN(Date.parse(draft)) ? draft : ""}
          onChange={(e) => setDraft(e.target.value)} onKeyDown={handleKeyDown} onBlur={() => commit(draft)}
          className="editable-input" />
      </div>
    );
  }
  if (col.type === "number") return <input type="number" {...common} />;
  return <input type="text" {...common} />;
}

function LedgerHeader({ columns, stickyOffsets }) {
  const { topRow, bottomRow } = getGroupedHeaderRows(columns);
  return (
    <thead>
      <tr>
        {topRow.map((h) => {
          const firstCol = columns.find((c) => (h.single ? c.key === h.key : c.group === h.key));
          const isSticky = firstCol && firstCol.sticky;
          const stickyLeft = isSticky ? stickyOffsets[firstCol.key] : undefined;
          return (
            <th key={h.key} colSpan={h.span} rowSpan={h.single ? 2 : 1}
              className={`ledger-th-top ${isSticky ? 'ledger-th-sticky-left' : ''}`}
              style={stickyLeft !== undefined ? { left: stickyLeft } : undefined}>
              {h.label}
            </th>
          );
        })}
        <th rowSpan={2} className="ledger-th-top ledger-th-sticky-right">Actions</th>
      </tr>
      <tr>
        {bottomRow.filter((b) => !b.blank).map((b) => (
          <th key={b.colKey} className="ledger-th-bottom">{b.label}</th>
        ))}
      </tr>
    </thead>
  );
}

export default function ScholarManagement() {
  const [rows, setRows] = useState(seed);
  const [editingCell, setEditingCell] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dcFilter, setDcFilter] = useState("");

  const stickyOffsets = useMemo(() => computeStickyOffsets(COLUMNS), []);
  const departments = useMemo(() => [...new Set(rows.map((r) => r.department).filter(Boolean))], [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (department && row.department !== department) return false;
      if (paymentFilter) {
        const years = Object.values(row.feesPaymentDates || {});
        const anyPaid = years.some((v) => !!v);
        if (paymentFilter === "paid" && !anyPaid) return false;
        if (paymentFilter === "pending" && anyPaid && years.every((v) => !!v)) return false;
      }
      if (dcFilter) {
        const dc = Object.values(row.dateOfDcMeeting || {});
        const anyDone = dc.some((v) => !!v);
        if (dcFilter === "completed" && !anyDone) return false;
        if (dcFilter === "none" && anyDone) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = [row.scholarName, row.regNo, row.guideName, row.remarks].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, department, paymentFilter, dcFilter, search]);

  const updateRow = (visibleIndex, nextRow) => {
    const targetRow = filteredRows[visibleIndex];
    const realIndex = rows.indexOf(targetRow);
    setRows((prev) => { const copy = [...prev]; copy[realIndex] = nextRow; return copy; });
  };
  const deleteRow = (visibleIndex) => {
    const targetRow = filteredRows[visibleIndex];
    setRows((prev) => prev.filter((r) => r !== targetRow));
  };
  const addRow = () => {
    setRows((prev) => [...prev, {
      sNo: prev.length + 1, department: "", guideName: "", scholarName: "", regNo: "", gender: "",
      fullPartTime: "", residentialAddress: "", nationalityState: "", religionCommunity: "",
      dateOfBirth: "", mobileNo: "", universityRefNoWithYear: "",
      dateOfDcMeeting: { I: "", II: "", III: "" }, extension: { I: "", II: "" },
      feesPaymentDates: { I: "", II: "", III: "", IV: "", V: "", VI: "", VII: "", VIII: "" },
      synopsisSubmittedOn: "", publicVivaOn: "", remarks: "", _tempId: Math.random(),
    }]);
  };

  const exportCsv = () => {
    const flat = filteredRows.map((row) => {
      const out = {};
      for (const col of COLUMNS) {
        if (col.key.includes(".")) {
          const [p, s] = col.key.split(".");
          out[`${col.group} ${s}`] = (row[p] && row[p][s]) || "";
        } else out[col.label] = row[col.key] ?? "";
      }
      return out;
    });
    const headers = Object.keys(flat[0] || {});
    const esc = (v) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const csv = [headers.map(esc).join(","), ...flat.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "phd_ledger.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ledger-container">
      <h1 className="ledger-title">
        PhD Scholar Register
      </h1>

      <div className="ledger-toolbar">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scholar, reg. no., guide, remarks…"
          className="search-input" />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="">Payment: Any</option>
          <option value="paid">Any Year Paid</option>
          <option value="pending">Any Year Pending</option>
        </select>
        <select value={dcFilter} onChange={(e) => setDcFilter(e.target.value)}>
          <option value="">DC Meeting: Any</option>
          <option value="completed">At Least One Completed</option>
          <option value="none">None Completed</option>
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={addRow} className="ledger-btn ledger-btn-primary">+ Add Row</button>
        <button onClick={exportCsv} className="ledger-btn ledger-btn-secondary">Export CSV</button>
        <button onClick={() => window.print()} className="ledger-btn ledger-btn-secondary">Download as Ledger PDF</button>
      </div>

      <div className="ledger-table-wrapper">
        <table className="ledger-table">
          <LedgerHeader columns={COLUMNS} stickyOffsets={stickyOffsets} />
          <tbody>
            {filteredRows.map((row, idx) => {
              const rowClass = idx % 2 === 0 ? "ledger-tr-even" : "ledger-tr-odd";
              return (
                <tr key={row.regNo || row._tempId || idx} className={rowClass}>
                  {COLUMNS.map((col) => {
                    const cellId = `${idx}:${col.key}`;
                    const isEditing = editingCell === cellId;
                    const isSticky = col.sticky;
                    return (
                      <td key={col.key}
                        style={{ 
                          width: col.width, 
                          minWidth: col.width, 
                          left: isSticky ? stickyOffsets[col.key] : undefined,
                          backgroundColor: isSticky ? (idx % 2 === 0 ? "#ffffff" : "#f8fafc") : undefined
                        }}
                        className={`ledger-td ${isSticky ? 'ledger-td-sticky-left' : ''}`}>
                        <EditableCell row={row} col={col} isEditing={isEditing}
                          onStartEdit={() => setEditingCell(cellId)}
                          onCancel={() => setEditingCell(null)}
                          onCommit={(key, value) => { updateRow(idx, setValue(row, key, value)); setEditingCell(null); }} />
                      </td>
                    );
                  })}
                  <td className={`ledger-td ledger-td-sticky-right`} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc", textAlign: "center" }}>
                    <button onClick={() => deleteRow(idx)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={COLUMNS.length + 1} style={{ padding: 0 }}>
                <button onClick={addRow} className="add-row-btn">+ Add Row</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="ledger-footer-text">
        Showing {filteredRows.length} of {rows.length} scholars. Double-click any cell to edit, Enter to save, Esc to cancel. Use "+ Add Row" (top toolbar or bottom of table) to add a new blank scholar entry.
      </div>
    </div>
  );
}

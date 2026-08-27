import React, { useState, useMemo } from "react";
import { Plus, Trash2, Pencil, Save, X, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// CONCEPT: "constants outside the component"
// Things that never change while the app is running (dropdown choices, column
// definitions) are kept outside the component function. This way React does
// not recreate them on every re-render - it's a small performance habit.
// ---------------------------------------------------------------------------
const DEPARTMENTS = [
  "Computer Science",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Commerce",
  "English",
  "Zoology",
  "Botany",
];

const REVIEW_STATUS = ["Pending", "In Review", "Approved", "Revision Needed"];
const COMPLETION_STATUS = ["Ongoing", "Submitted", "Viva Completed", "Awarded"];

// Every column the register needs. Keeping this as one list means the header
// row and every data row can be built by looping over the SAME array -
// so header and body can never drift out of sync.
const COLUMNS = [
  { key: "sno", label: "S.No", width: 60, type: "text", sticky: "left" },
  { key: "registerNo", label: "Register No.", width: 130, type: "text" },
  { key: "dateOfRegistration", label: "Date of Registration", width: 150, type: "date" },
  { key: "scholarName", label: "Name of Scholar", width: 180, type: "text" },
  { key: "dob", label: "Date of Birth", width: 130, type: "date" },
  { key: "department", label: "Department", width: 160, type: "select", options: DEPARTMENTS },
  { key: "title", label: "Title of Research", width: 240, type: "text" },
  { key: "guideName", label: "Guide Name", width: 160, type: "text" },
  { key: "coGuideName", label: "Co-Guide Name", width: 160, type: "text" },
  { key: "address", label: "Residential Address", width: 220, type: "text" },
  { key: "provisionalRegDate", label: "Date of Provisional Reg.", width: 170, type: "date" },
  { key: "extension", label: "Extension", width: 110, type: "text" },
  { key: "progressRemarks", label: "Progress Remarks", width: 200, type: "text" },
  { key: "reviewStatus", label: "Review Status", width: 150, type: "select", options: REVIEW_STATUS },
  { key: "vivaDate", label: "Date of Viva Voce", width: 150, type: "date" },
  { key: "completionStatus", label: "Completion Status", width: 160, type: "select", options: COMPLETION_STATUS },
];

// A little starting data so the register isn't empty on first load.
const INITIAL_DATA = [
  {
    id: 1,
    sno: 1,
    registerNo: "PHD/CS/001",
    dateOfRegistration: "2022-06-14",
    scholarName: "A. Karthikeyan",
    dob: "1994-03-11",
    department: "Computer Science",
    title: "Energy-Aware Routing in Wireless Sensor Networks",
    guideName: "Dr. R. Anand",
    coGuideName: "",
    address: "12 Gandhi Nagar, Trichy",
    provisionalRegDate: "2022-07-01",
    extension: "-",
    progressRemarks: "Chapter 3 completed",
    reviewStatus: "In Review",
    vivaDate: "",
    completionStatus: "Ongoing",
  },
  {
    id: 2,
    sno: 2,
    registerNo: "PHD/PHY/014",
    dateOfRegistration: "2021-01-20",
    scholarName: "S. Meena",
    dob: "1992-11-02",
    department: "Physics",
    title: "Thin Film Semiconductor Characterization",
    guideName: "Dr. V. Prakash",
    coGuideName: "Dr. N. Suresh",
    address: "45 Bharathi Street, Thanjavur",
    provisionalRegDate: "2021-02-05",
    extension: "6 months",
    progressRemarks: "Awaiting viva scheduling",
    reviewStatus: "Approved",
    vivaDate: "2026-09-10",
    completionStatus: "Submitted",
  },
  {
    id: 3,
    sno: 3,
    registerNo: "PHD/CHE/007",
    dateOfRegistration: "2020-08-09",
    scholarName: "R. Lakshmi Priya",
    dob: "1991-05-27",
    department: "Chemistry",
    title: "Green Synthesis of Nanoparticles",
    guideName: "Dr. K. Devi",
    coGuideName: "",
    address: "8 Kamaraj Road, Madurai",
    provisionalRegDate: "2020-09-01",
    extension: "-",
    progressRemarks: "Awarded degree",
    reviewStatus: "Approved",
    vivaDate: "2025-12-18",
    completionStatus: "Awarded",
  },
];

// A blank row template used whenever "Add Scholar" is clicked.
const emptyRow = (nextSno) =>
  COLUMNS.reduce(
    (row, col) => ({ ...row, [col.key]: "" }),
    { id: Date.now(), sno: nextSno }
  );

const PAGE_SIZE = 8;

export default function ScholarManagement() {
  // ---------------------------------------------------------------------
  // CONCEPT: "state"
  // useState gives a component memory. `data` holds every row of the
  // register. Whenever we call setData(...), React re-renders the table
  // with the new array - that's the whole trick behind "live" UI.
  // ---------------------------------------------------------------------
  const [data, setData] = useState(INITIAL_DATA);

  // Which row is currently being edited (its id), or null if none.
  const [editingId, setEditingId] = useState(null);
  // A scratch copy of the row being edited, so typing doesn't change the
  // real table until "Save" is pressed.
  const [draftRow, setDraftRow] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // -----------------------------------------------------------------------
  // CONCEPT: "derived state" with useMemo
  // Instead of storing a separate "filteredData" in useState, we CALCULATE
  // it from `data` and `search` every render. useMemo just avoids redoing
  // that calculation unless data/search actually changed. This keeps the
  // filtered list always correct - there's no way for it to go stale.
  // -----------------------------------------------------------------------
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (row) =>
        (row.scholarName || "").toLowerCase().includes(q) ||
        (row.registerNo || "").toLowerCase().includes(q) ||
        (row.guideName || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pageData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ---- Row actions --------------------------------------------------------

  function handleAddRow() {
    const nextSno = data.length ? Math.max(...data.map((r) => r.sno)) + 1 : 1;
    const newRow = emptyRow(nextSno);
    setData((prev) => [...prev, newRow]);
    setEditingId(newRow.id);
    setDraftRow(newRow);
    // Jump to the last page so the new row is visible immediately.
    setPage(Math.ceil((filteredData.length + 1) / PAGE_SIZE));
  }

  function startEdit(row) {
    setEditingId(row.id);
    setDraftRow({ ...row }); // copy, so cancelling doesn't lose the original
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftRow(null);
  }

  function saveEdit() {
    setData((prev) => prev.map((r) => (r.id === draftRow.id ? draftRow : r)));
    setEditingId(null);
    setDraftRow(null);
  }

  function deleteRow(id) {
    if (!window.confirm("Delete this scholar's record?")) return;
    setData((prev) => prev.filter((r) => r.id !== id));
  }

  function updateDraft(key, value) {
    setDraftRow((prev) => ({ ...prev, [key]: value }));
  }

  // ---- Export to CSV -------------------------------------------------------
  // CONCEPT: A CSV file is just plain text with commas between values and a
  // newline between rows. We build that text ourselves, wrap it in a Blob
  // (an in-memory "file"), then trigger a browser download of it.
  function exportCSV() {
    const header = COLUMNS.map((c) => c.label).join(",");
    const rows = filteredData.map((row) =>
      COLUMNS.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "phd_scholar_register.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ background: "#f7f6f3", minHeight: "100%", padding: "24px" }}>
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        {/* ---------------- Header ---------------- */}
        <div style={{ marginBottom: "16px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", fontFamily: "Georgia, serif" }}>
            PhD Scholar Register
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
            Digital record of scholar registration, progress and viva status
          </p>
        </div>

        {/* ---------------- Toolbar ---------------- */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            marginBottom: "10px",
            padding: "10px 12px",
            background: "#ffffff",
            border: "1px solid #d1d5db",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search
              size={15}
              style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, register no., or guide"
              style={{
                width: "100%",
                padding: "7px 8px 7px 28px",
                border: "1px solid #d1d5db",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <button onClick={handleAddRow} style={btnStyle("#1f2937")}>
            <Plus size={14} /> Add Scholar
          </button>

          <button onClick={exportCSV} style={btnStyle("#374151")}>
            <Download size={14} /> Export CSV
          </button>

          <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "auto" }}>
            {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ---------------- Table ---------------- */}
        <div
          style={{
            overflow: "auto",
            maxHeight: "560px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
          }}
        >
          <table style={{ borderCollapse: "collapse", fontSize: "12.5px", width: "max-content" }}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      position: "sticky",
                      top: 0,
                      left: col.sticky === "left" ? 0 : undefined,
                      zIndex: col.sticky === "left" ? 3 : 2,
                      minWidth: col.width,
                      background: "#eef1f5",
                      borderBottom: "2px solid #9ca3af",
                      borderRight: "1px solid #d1d5db",
                      padding: "8px 6px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "#1f2937",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
                <th
                  style={{
                    position: "sticky",
                    top: 0,
                    right: 0,
                    zIndex: 3,
                    minWidth: 90,
                    background: "#eef1f5",
                    borderBottom: "2px solid #9ca3af",
                    borderLeft: "1px solid #d1d5db",
                    padding: "8px 6px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#1f2937",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length + 1}
                    style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}
                  >
                    No matching records. Try a different search, or add a new scholar.
                  </td>
                </tr>
              )}
              {pageData.map((row, rowIdx) => {
                const isEditing = editingId === row.id;
                const activeRow = isEditing ? draftRow : row;
                return (
                  <tr key={row.id} style={{ background: rowIdx % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          position: col.sticky === "left" ? "sticky" : undefined,
                          left: col.sticky === "left" ? 0 : undefined,
                          zIndex: col.sticky === "left" ? 1 : undefined,
                          background: col.sticky === "left" ? (rowIdx % 2 === 0 ? "#ffffff" : "#fafafa") : undefined,
                          borderBottom: "1px solid #e5e7eb",
                          borderRight: "1px solid #e5e7eb",
                          padding: "5px 6px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isEditing && col.key !== "sno" ? (
                          <EditableField col={col} value={activeRow[col.key]} onChange={updateDraft} />
                        ) : (
                          <span style={{ color: col.key === "sno" ? "#6b7280" : "#111827" }}>
                            {activeRow[col.key] || "-"}
                          </span>
                        )}
                      </td>
                    ))}
                    <td
                      style={{
                        position: "sticky",
                        right: 0,
                        background: rowIdx % 2 === 0 ? "#ffffff" : "#fafafa",
                        borderBottom: "1px solid #e5e7eb",
                        borderLeft: "1px solid #e5e7eb",
                        padding: "5px 6px",
                        textAlign: "center",
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button onClick={saveEdit} title="Save" style={iconBtnStyle("#15803d")}>
                            <Save size={14} />
                          </button>
                          <button onClick={cancelEdit} title="Cancel" style={iconBtnStyle("#6b7280")}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button onClick={() => startEdit(row)} title="Edit" style={iconBtnStyle("#1f2937")}>
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteRow(row.id)} title="Delete" style={iconBtnStyle("#b91c1c")}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ---------------- Pagination ---------------- */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={iconBtnStyle("#1f2937", page === 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: "12.5px", color: "#374151" }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={iconBtnStyle("#1f2937", page === totalPages)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EditableField({ col, value, onChange }) {
  const baseStyle = {
    width: "100%",
    minWidth: col.width - 16,
    padding: "4px 5px",
    border: "1px solid #9ca3af",
    fontSize: "12.5px",
    outline: "none",
  };

  if (col.type === "select") {
    return (
      <select value={value || ""} onChange={(e) => onChange(col.key, e.target.value)} style={baseStyle}>
        <option value="">-</option>
        {col.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (col.type === "date") {
    return (
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(col.key, e.target.value)}
        style={baseStyle}
      />
    );
  }

  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(col.key, e.target.value)}
      style={baseStyle}
    />
  );
}

function btnStyle(bg) {
  return {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 12px",
    background: bg,
    color: "#ffffff",
    border: "none",
    fontSize: "12.5px",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function iconBtnStyle(color, disabled) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px",
    height: "26px",
    background: "transparent",
    border: `1px solid ${disabled ? "#e5e7eb" : color}`,
    color: disabled ? "#d1d5db" : color,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

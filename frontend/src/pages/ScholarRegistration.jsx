import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import toast from "react-hot-toast";

const STEPS = [
  { key: "personal", label: "01-08 Personal" },
  { key: "contact", label: "09-17 Contact" },
  { key: "academic", label: "18-20 Academic & Service" },
  { key: "research", label: "21-29 Research & Guide" },
  { key: "payment", label: "30 Payment & Sign" },
  { key: "review", label: "Review & Submit" },
];

const RELIGIONS = ["Christian", "Hindu", "Muslim", "Others"];
const COMMUNITIES = ["SC", "ST", "BC", "MBC", "OBC", "OC"];
const QUAL_EXAMS = ["Qualifying Examination", "NET", "SET", "GATE", "UGC – CSIR", "Other"];
const STUDY_TYPES = ["Regular", "Private", "Other Study"];

const defaultSchoolQuals = () => [
  { course: "S.S.L.C (X Std)", school: "", board: "", degreeSubject: "", percentage: "", yearOfPassing: "", studyType: "Regular" },
  { course: "HSC (+2)", school: "", board: "", degreeSubject: "", percentage: "", yearOfPassing: "", studyType: "Regular" },
  { course: "Other", school: "", board: "", degreeSubject: "", percentage: "", yearOfPassing: "", studyType: "Regular" },
];

const defaultHigherQuals = () => [
  { degree: "UG", college: "", university: "", subjectsStudied: "", percentage: "", yearOfPassing: "", studyType: "Regular" },
  { degree: "PG", college: "", university: "", subjectsStudied: "", percentage: "", yearOfPassing: "", studyType: "Regular" },
  { degree: "M.Phil", college: "", university: "", subjectsStudied: "", percentage: "", yearOfPassing: "", studyType: "Regular" },
];

const emptyServiceRow = () => ({
  id: Math.random().toString(36).slice(2),
  designation: "",
  from: "",
  to: "",
  institution: "",
  email: "",
});

function SectionHeader({ number, title, subtitle }) {
  return (
    <div style={{ marginBottom: 18, borderBottom: "1.5px solid var(--parchment-line)", paddingBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: "var(--oxblood)", background: "#F5EBE6", padding: "2px 8px", borderRadius: 4 }}>
          Item {number}
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--oxblood-deep)" }}>
          {title}
        </span>
      </div>
      {subtitle && <div style={{ fontSize: 12, color: "#8A8375", marginTop: 3 }}>{subtitle}</div>}
    </div>
  );
}

function Field({ label, required, children, hint, error, number }) {
  return (
    <label className="block mb-5">
      <span className="flex items-baseline gap-1 mb-1.5 text-sm" style={{ color: "var(--ink)", fontWeight: 500 }}>
        {number && <span style={{ color: "var(--oxblood)", fontWeight: 700, marginRight: 4 }}>{number}.</span>}
        {label}
        {required && <span style={{ color: "var(--oxblood)", fontWeight: "bold" }}>*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="block mt-1 text-xs" style={{ color: "#8A8375" }}>{hint}</span>
      )}
      {error && (
        <span className="block mt-1 text-xs" style={{ color: "var(--rust)", fontWeight: 500 }}>{error}</span>
      )}
    </label>
  );
}

function TextInput(props) {
  return <input {...props} className={"field-underline " + (props.className || "")} />;
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      rows={props.rows || 2}
      className={"field-underline " + (props.className || "")}
      style={{ resize: "vertical", minHeight: 48, ...(props.style || {}) }}
    />
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className="segmented-btn"
            style={
              active
                ? { background: "var(--oxblood)", color: "#FBF3E7", borderColor: "var(--oxblood)" }
                : {}
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SignaturePad({ label, value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#2B2418";
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
  }, []);

  const pos = (e, c) => {
    const rect = c.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e) => {
    drawing.current = true;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const { x, y } = pos(e, c);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const { x, y } = pos(e, c);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(canvasRef.current.toDataURL());
  };
  const clear = () => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    onChange(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span className="text-sm" style={{ color: "var(--ink)", fontWeight: 500 }}>{label}</span>
        <button type="button" onClick={clear} className="text-xs underline" style={{ color: "#8A8375", background: "none", border: "none", cursor: "pointer" }}>
          clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={420}
        height={110}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        style={{
          width: "100%",
          maxWidth: 420,
          height: 110,
          background: "#FFFDF7",
          border: "1px solid var(--parchment-line)",
          borderRadius: 2,
          touchAction: "none",
          cursor: "crosshair",
        }}
      />
      <div className="text-xs mt-1" style={{ color: "#8A8375" }}>Sign above with mouse, stylus or finger</div>
    </div>
  );
}

/* -- Status Screen (after submission) with official Bharathidasan printout -- */
function StatusScreen({ status, rejectionReason, onLogout, formData }) {
  const handlePrint = () => {
    const fd = formData || {};
    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Please allow popups to download/print PDF");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>PhD Registration - ${fd.candidateName || fd.fullName || "Scholar"}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @page { size: A4; margin: 12mm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10.5pt; color: #111; background: #fff;
            padding: 10px; line-height: 1.35;
          }
          .hdr { text-align: center; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
          .hdr h1 { font-size: 14pt; font-weight: bold; letter-spacing: 0.5px; }
          .hdr h2 { font-size: 11pt; font-weight: bold; margin-top: 2px; }
          .hdr p { font-size: 9.5pt; margin-top: 2px; }
          .doc-sub { font-size: 9pt; font-weight: bold; text-decoration: underline; margin-top: 6px; }
          .photo-box {
            position: absolute; top: 44mm; right: 12mm; width: 35mm; height: 42mm;
            border: 1px solid #333; text-align: center; display: flex;
            align-items: center; justify-content: center; font-size: 8pt; color: #555;
          }
          .photo-box img { width: 100%; height: 100%; object-fit: cover; }
          table.items { width: 100%; border-collapse: collapse; margin-top: 6px; }
          table.items td { padding: 4px 6px; vertical-align: top; font-size: 10pt; }
          table.items td.num { width: 32px; font-weight: bold; text-align: right; padding-right: 8px; }
          table.items td.lbl { width: 34%; font-weight: 600; color: #222; }
          table.items td.val { width: 62%; }
          table.grid { width: 100%; border-collapse: collapse; margin: 6px 0 10px; }
          table.grid th, table.grid td { border: 1px solid #444; padding: 4px 6px; font-size: 8.5pt; text-align: left; }
          table.grid th { background: #f0f0f0; font-weight: bold; }
          .sig-row { display: flex; justify-content: space-between; margin-top: 36px; padding-top: 10px; }
          .sig-cell { text-align: center; width: 23%; font-size: 8.5pt; }
          .sig-cell .line { border-top: 1px solid #111; margin-top: 36px; padding-top: 4px; font-weight: 600; }
          .approved-stamp {
            border: 2px solid #2E6930; color: #2E6930; border-radius: 4px;
            padding: 4px 14px; font-weight: bold; font-size: 11pt;
            letter-spacing: 2px; transform: rotate(-3deg); display: inline-block;
          }
        </style>
      </head>
      <body onload="window.print();">
        <div class="photo-box">
          ${fd.photo ? `<img src="${fd.photo}" alt="Photo" />` : `Affix Recent Passport Size Photograph`}
        </div>

        <div class="hdr">
          <h1>BHARATHIDASAN UNIVERSITY</h1>
          <h2>TIRUCHIRAPPALLI – 24.</h2>
          <p style="font-weight:bold; margin-top:4px;">APPLICATION FORM FOR ADMISSION AND PROVISIONAL REGISTRATION FOR THE DEGREE OF DOCTOR OF PHILOSOPHY (Ph.D)</p>
          <p style="font-size:8.5pt; color:#444;">Research Centre: St. Joseph's College (Autonomous), Tiruchirappalli - 620 002</p>
          <div class="doc-sub">INFORMATION TO BE PROVIDED BY THE CANDIDATE</div>
        </div>

        <table class="items">
          <tr><td class="num">1.</td><td class="lbl">Category under which registration is sought</td><td class="val"><strong>${fd.category || "-"}</strong></td></tr>
          <tr><td class="num">2.</td><td class="lbl">Discipline / Subject which registration is sought</td><td class="val">${fd.discipline || fd.subject || "-"}</td></tr>
          <tr><td class="num">3.</td><td class="lbl">Name of the Candidate (as entered in Degree Certificate)</td><td class="val"><strong>${fd.candidateName || fd.fullName || "-"}</strong></td></tr>
          <tr><td class="num">4.</td><td class="lbl">Date of Birth & Age</td><td class="val">${fd.dob || "-"} &nbsp; (${fd.age ? fd.age + " Yrs" : "-"})</td></tr>
          <tr><td class="num">5.</td><td class="lbl">Sex</td><td class="val">${fd.sex || fd.gender || "-"}</td></tr>
          <tr><td class="num">6.</td><td class="lbl">Nationality / Religion</td><td class="val">${fd.nationality || "Indian"} / ${fd.religion || "-"} ${fd.christianDenom ? `(${fd.christianDenom})` : ""}</td></tr>
          <tr><td class="num">7.</td><td class="lbl">Community</td><td class="val">${fd.community || "-"}</td></tr>
          <tr><td class="num">8.</td><td class="lbl">Physically or Visually Challenged</td><td class="val">${fd.physicallyChallenged || "No"} ${fd.physicallyChallengedDetails ? `(${fd.physicallyChallengedDetails})` : ""}</td></tr>
          <tr><td class="num">9.</td><td class="lbl">Father’s / Guardian’s Name & Address</td><td class="val">${fd.fatherGuardianDetails || "-"}</td></tr>
          <tr><td class="num">10.</td><td class="lbl">Address to which Communication to be sent (with Pincode)</td><td class="val">${fd.communicationAddress || `${fd.street || ""}, ${fd.city || ""}, ${fd.district || ""}, ${fd.state || ""} - ${fd.pincode || ""}`}</td></tr>
          <tr><td class="num">11.</td><td class="lbl">If Part Time Candidate (Working Address)</td><td class="val">${fd.workingAddress || (fd.category === "Part Time" ? fd.institutionName || "-" : "N/A")}</td></tr>
          <tr><td class="num">12.</td><td class="lbl">Phone Number</td><td class="val">${fd.phone || "-"}</td></tr>
          <tr><td class="num">13.</td><td class="lbl">FAX</td><td class="val">${fd.fax || "-"}</td></tr>
          <tr><td class="num">14.</td><td class="lbl">Mobile Number</td><td class="val">${fd.mobile || fd.mobile1 || "-"}</td></tr>
          <tr><td class="num">15.</td><td class="lbl">E-mail</td><td class="val">${fd.email || "-"}</td></tr>
          <tr><td class="num">16.</td><td class="lbl">Aadhaar No / Voter ID</td><td class="val">${fd.idProofNumber || "-"} (${fd.idProofType || "Aadhaar"})</td></tr>
          <tr><td class="num">17.</td><td class="lbl">Passport No. / Visa Period</td><td class="val">${fd.passportNo ? `${fd.passportNo} / ${fd.visaPeriod || "N/A"}` : "N/A"}</td></tr>
        </table>

        <div style="font-weight:bold; margin: 12px 0 4px 6px; font-size:10pt;">
          18. Educational Qualification:
        </div>
        <table class="grid">
          <thead>
            <tr>
              <th>Course / Degree</th>
              <th>School / Institution / College</th>
              <th>Board / University</th>
              <th>Subject Studied</th>
              <th>% Marks</th>
              <th>Month & Year</th>
              <th>Mode of Study</th>
            </tr>
          </thead>
          <tbody>
            ${(fd.schoolQuals || []).map(r => `
              <tr>
                <td><strong>${r.course}</strong></td>
                <td>${r.school || "-"}</td>
                <td>${r.board || "-"}</td>
                <td>${r.degreeSubject || "-"}</td>
                <td>${r.percentage || "-"}</td>
                <td>${r.yearOfPassing || "-"}</td>
                <td>${r.studyType || "-"}</td>
              </tr>
            `).join("")}
            ${(fd.higherQuals || []).map(r => `
              <tr>
                <td><strong>${r.degree}</strong></td>
                <td>${r.college || "-"}</td>
                <td>${r.university || "-"}</td>
                <td>${r.subjectsStudied || "-"}</td>
                <td>${r.percentage || "-"}</td>
                <td>${r.yearOfPassing || "-"}</td>
                <td>${r.studyType || "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="font-size: 8.5pt; font-weight: bold; margin-bottom: 4px;">Marks / Grades obtained in Post Graduate Programme:</div>
        <table class="grid" style="margin-bottom: 10px;">
          <thead>
            <tr>
              <th>Total Marks Obtained</th>
              <th>Total Maximum Marks</th>
              <th>Percentage of Marks</th>
              <th>Class Obtained</th>
              <th>CGPA</th>
              <th>Overall Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${fd.pgGrades?.totalMarksObtained || "-"}</td>
              <td>${fd.pgGrades?.totalMaxMarks || "-"}</td>
              <td>${fd.pgGrades?.percentageMarks || "-"}</td>
              <td>${fd.pgGrades?.classObtained || "-"}</td>
              <td>${fd.pgGrades?.cgpa || "-"}</td>
              <td>${fd.pgGrades?.overallGrade || "-"}</td>
            </tr>
          </tbody>
        </table>

        <table class="items">
          <tr><td class="num">19.</td><td class="lbl">Ph.D. Registration Qualifying Examination</td><td class="val">${fd.qualExamType || "-"} &nbsp;|&nbsp; Reg No: ${fd.qualExamRegNo || "-"} &nbsp;|&nbsp; Month & Year: ${fd.qualExamMonthYear || "-"}</td></tr>
          <tr><td class="num">20.</td><td class="lbl">Particular of service for Part-Time Candidates</td><td class="val">Total Service: <strong>${fd.totalServiceYears || "0"} Years</strong></td></tr>
        </table>

        ${(fd.serviceRecords && fd.serviceRecords.length > 0 && fd.serviceRecords[0].designation) ? `
          <table class="grid" style="margin-left: 36px; width: 94%;">
            <thead><tr><th>Designation</th><th>From</th><th>To</th><th>Institution / Organization</th><th>Email</th></tr></thead>
            <tbody>
              ${fd.serviceRecords.map(s => `
                <tr><td>${s.designation}</td><td>${s.from}</td><td>${s.to}</td><td>${s.institution}</td><td>${s.email}</td></tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}

        <table class="items">
          <tr><td class="num">21.</td><td class="lbl">Whether the Candidate awarded any fellowship</td><td class="val"><strong>${fd.fellowshipAwarded || "No"}</strong></td></tr>
          ${fd.fellowshipAwarded === "Yes" ? `
            <tr><td class="num">22.</td><td class="lbl">Fellowship Details</td><td class="val">Sponsor: ${fd.fellowshipSponsor || "-"} | Amount: ${fd.fellowshipAmount || "-"} | Period: ${fd.fellowshipPeriod || "-"}</td></tr>
          ` : `<tr><td class="num">22.</td><td class="lbl">Name of Sponsor & Fellowship Details</td><td class="val">N/A</td></tr>`}
          <tr><td class="num">23.</td><td class="lbl">Place where admission is sought to Conduct research</td><td class="val">${fd.researchDepartment || "St. Joseph's College (Autonomous), Tiruchirappalli"}</td></tr>
          <tr><td class="num">24.</td><td class="lbl">Registration sought in interdisciplinary area</td><td class="val">${fd.isInterdisciplinary || "No"} ${fd.interdisciplinaryArea ? `(${fd.interdisciplinaryArea})` : ""}</td></tr>
          <tr><td class="num">25.</td><td class="lbl">Broad Topic of Research</td><td class="val"><strong>${fd.broadTopic || fd.researchTitle || "-"}</strong></td></tr>
          <tr><td class="num">26.</td><td class="lbl">Supervisor / Guide Details</td><td class="val">${fd.supervisorName || fd.guide || "-"} ${fd.supervisorAddress ? `, ${fd.supervisorAddress}` : ""} ${fd.supervisorSuperannuation ? `(Superannuation: ${fd.supervisorSuperannuation})` : ""}</td></tr>
          <tr><td class="num">27.</td><td class="lbl">Total Ph.D. Scholars working under Supervisor</td><td class="val">Full-Time: <strong>${fd.supervisorScholarsFullTime || "0"}</strong> &nbsp;|&nbsp; Part-Time: <strong>${fd.supervisorScholarsPartTime || "0"}</strong></td></tr>
          <tr><td class="num">28.</td><td class="lbl">Co-Supervisor / Co-Guide (Inter-disciplinary)</td><td class="val">${fd.coSupervisorInterdisciplinary?.name || "N/A"}</td></tr>
          <tr><td class="num">29.</td><td class="lbl">Co-Supervisor / Co-Guide (Part-Time)</td><td class="val">${fd.coSupervisorPartTime?.name || "N/A"}</td></tr>
          <tr><td class="num">30.</td><td class="lbl">Payment Details</td><td class="val">Receipt/DD No: <strong>${fd.paymentDetails?.receiptNo || "-"}</strong> | Date: ${fd.paymentDetails?.transactionDate || "-"} | Amount: <strong>₹${fd.paymentDetails?.amount || "-"}</strong> | Bank: ${fd.paymentDetails?.bankName || "-"} (${fd.paymentDetails?.branchName || "-"})</td></tr>
        </table>

        <div style="margin-top: 14px; font-size: 8.5pt; font-style: italic; border-top: 1px dashed #777; padding-top: 6px;">
          I declare that all the particulars furnished above are correct and I submit that I will abide by the rules and regulations of Bharathidasan University and the Research Centre.
        </div>

        <div class="sig-row">
          <div class="sig-cell">
            ${fd.signature ? `<img src="${fd.signature}" style="max-height: 38px; display:block; margin: 0 auto 4px;" />` : `<div style="height:38px;"></div>`}
            <div class="line">Signature of Applicant</div>
          </div>
          <div class="sig-cell">
            <div style="height:38px;"></div>
            <div class="line">Signature of Research Supervisor / Guide</div>
          </div>
          <div class="sig-cell">
            <div style="height:38px;"></div>
            <div class="line">Head of Department</div>
          </div>
          <div class="sig-cell">
            <div style="height:38px;"></div>
            <div class="line">Head of Institution / Principal</div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (status === "Pending") return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h2 style={{ color: "#6B1F2A", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>Registration Submitted!</h2>
      <p style={{ color: "#8A8375", maxWidth: 460, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Your official Ph.D admission application (Items 1 to 30) has been submitted to the Academic Administration.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={handlePrint} style={{
          padding: "10px 22px", background: "#A9823E",
          color: "#fff", border: "none", borderRadius: 4,
          fontWeight: 600, fontSize: 13.5, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8
        }}>
          🖨️ View / Print Application PDF
        </button>
        <button onClick={onLogout} style={{
          padding: "10px 22px", background: "#6B1F2A",
          color: "#FBF3E7", border: "none", borderRadius: 4,
          fontWeight: 500, fontSize: 13.5, cursor: "pointer",
        }}>
          Logout
        </button>
      </div>
    </div>
  );

  if (status === "Approved") return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: "#4C6B58", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>Registration Officially Approved!</h2>
      <p style={{ color: "#8A8375", maxWidth: 460, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Congratulations! Your Ph.D registration under Bharathidasan University regulations has been approved.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={handlePrint} style={{
          padding: "10px 24px", background: "#4C6B58",
          color: "#fff", border: "none", borderRadius: 4,
          fontWeight: 600, fontSize: 14, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8
        }}>
          📄 Download Official Application PDF
        </button>
        <button onClick={onLogout} style={{
          padding: "10px 24px", background: "#6B1F2A",
          color: "#FBF3E7", border: "none", borderRadius: 4,
          fontWeight: 500, fontSize: 14, cursor: "pointer",
        }}>
          Logout
        </button>
      </div>
    </div>
  );

  if (status === "Rejected") return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
      <h2 style={{ color: "#A34A28", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>Registration Not Accepted</h2>
      {rejectionReason && (
        <div style={{
          background: "#FFFDF7", border: "1px solid #A34A28",
          borderRadius: 8, padding: "14px 20px", maxWidth: 460,
          margin: "0 auto 20px", textAlign: "left",
        }}>
          <div style={{ fontWeight: 600, color: "#A34A28", marginBottom: 4 }}>Reason from Admin:</div>
          <div style={{ color: "#232323", fontSize: 14 }}>{rejectionReason}</div>
        </div>
      )}
      <button onClick={onLogout} style={{
        padding: "10px 28px", background: "#6B1F2A",
        color: "#FBF3E7", border: "none", borderRadius: 4,
        fontWeight: 500, fontSize: 14, cursor: "pointer",
      }}>
        Logout
      </button>
    </div>
  );

  return null;
}

export default function ScholarRegistration() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [savedAt, setSavedAt] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  // Complete data model for Items 1 through 30
  const [data, setData] = useState({
    // Item 1
    category: "Full Time",
    // Item 2
    discipline: "",
    // Item 3
    candidateName: "",
    // Item 4
    dob: "",
    age: "",
    // Item 5
    sex: "Male",
    // Item 6
    nationality: "Indian",
    religion: "Christian",
    christianDenom: "Catholic",
    christianCluster: "Dalit",
    // Item 7
    community: "BC",
    // Item 8
    physicallyChallenged: "No",
    physicallyChallengedDetails: "",
    // Photo
    photo: null,

    // Item 9
    fatherGuardianDetails: "",
    // Item 10
    communicationAddress: "",
    street: "",
    city: "",
    district: "",
    state: "Tamil Nadu",
    pincode: "",
    // Item 11
    workingAddress: "",
    // Item 12
    phone: "",
    // Item 13
    fax: "",
    // Item 14
    mobile: "",
    // Item 15
    email: "",
    // Item 16
    idProofType: "Aadhaar No",
    idProofNumber: "",
    // Item 17
    passportNo: "",
    visaPeriod: "",

    // Item 18 tables handled via state
    pgGrades: {
      totalMarksObtained: "",
      totalMaxMarks: "",
      percentageMarks: "",
      classObtained: "",
      cgpa: "",
      overallGrade: "",
    },

    // Item 19
    qualExamType: "Qualifying Examination",
    qualExamOtherName: "",
    qualExamRegNo: "",
    qualExamMonthYear: "",

    // Item 20
    totalServiceYears: "",

    // Item 21
    fellowshipAwarded: "No",
    // Item 22
    fellowshipSponsor: "",
    fellowshipAmount: "",
    fellowshipPeriod: "",
    // Item 23
    researchDepartment: "Department of Computer Science, St. Joseph's College (Autonomous), Tiruchirappalli - 620 002",
    // Item 24
    isInterdisciplinary: "No",
    interdisciplinaryArea: "",
    // Item 25
    broadTopic: "",
    // Item 26
    supervisorName: "",
    supervisorAddress: "",
    supervisorSuperannuation: "",
    // Item 27
    supervisorScholarsFullTime: "0",
    supervisorScholarsPartTime: "0",
    // Item 28
    coSupervisorInterdisciplinary: { name: "", address: "", superannuation: "" },
    // Item 29
    coSupervisorPartTime: { name: "", address: "" },

    // Item 30
    paymentDetails: {
      receiptNo: "",
      transactionDate: new Date().toISOString().split("T")[0],
      amount: "3000",
      bankName: "State Bank of India",
      branchName: "Main Branch, Tiruchirappalli",
    },

    // Declaration
    declarationAccepted: false,
  });

  // Dynamic tables for Item 18 & 20
  const [schoolQuals, setSchoolQuals] = useState(defaultSchoolQuals());
  const [higherQuals, setHigherQuals] = useState(defaultHigherQuals());
  const [serviceRecords, setServiceRecords] = useState([emptyServiceRow()]);
  const [signature, setSignature] = useState(null);

  // Auto calculate age when DOB changes
  useEffect(() => {
    if (data.dob) {
      const birth = new Date(data.dob);
      if (!isNaN(birth.getTime())) {
        const diff = Date.now() - birth.getTime();
        const ageDate = new Date(diff);
        const calcAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        setData((d) => ({ ...d, age: String(calcAge) }));
      }
    }
  }, [data.dob]);

  // If not a test account user, redirect to login
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!user.isTestAccount) {
      navigate(`/${user.role?.toLowerCase() || "login"}`, { replace: true });
      return;
    }

    // Pre-fill user data
    setData((d) => ({
      ...d,
      candidateName: user.name || d.candidateName,
      email: user.email || d.email,
    }));

    fetchMyRegistration();
  }, [user]);

  const fetchMyRegistration = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("rms_token");
      const res = await apiFetch("/api/test-accounts/my-registration", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = await res.json();
      if (resData?.data) {
        setSubmissionStatus(resData.data.status);
        setRejectionReason(resData.data.rejectionReason || "");
        if (resData.data.formData) {
          const fd = resData.data.formData;
          setData((d) => ({
            ...d,
            ...fd,
            candidateName: fd.candidateName || fd.fullName || d.candidateName,
            discipline: fd.discipline || fd.subject || d.discipline,
            mobile: fd.mobile || fd.mobile1 || d.mobile,
            broadTopic: fd.broadTopic || fd.researchTitle || d.broadTopic,
            supervisorName: fd.supervisorName || fd.guide || d.supervisorName,
          }));
          if (fd.schoolQuals) setSchoolQuals(fd.schoolQuals);
          if (fd.higherQuals) setHigherQuals(fd.higherQuals);
          if (fd.serviceRecords) setServiceRecords(fd.serviceRecords);
          if (fd.signature) setSignature(fd.signature);
        }
      }
    } catch {
      // No submission yet
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => {
    const val = e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setData((d) => ({ ...d, [key]: val }));
  };

  const setNested = (parent, key) => (e) => {
    const val = e && e.target ? e.target.value : e;
    setData((d) => ({
      ...d,
      [parent]: { ...d[parent], [key]: val },
    }));
  };

  // Table update helpers
  const updateSchoolQual = (index, key, val) => {
    setSchoolQuals((rows) => rows.map((r, i) => (i === index ? { ...r, [key]: val } : r)));
  };
  const updateHigherQual = (index, key, val) => {
    setHigherQuals((rows) => rows.map((r, i) => (i === index ? { ...r, [key]: val } : r)));
  };
  const updateServiceRecord = (id, key, val) => {
    setServiceRecords((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  };
  const addServiceRow = () => setServiceRecords((rows) => [...rows, emptyServiceRow()]);
  const removeServiceRow = (id) =>
    setServiceRecords((rows) => (rows.length > 1 ? rows.filter((r) => r.id !== id) : rows));

  // Photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setData((d) => ({ ...d, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Autosave simulation
  useEffect(() => {
    const t = setTimeout(() => setSavedAt(new Date()), 700);
    return () => clearTimeout(t);
  }, [data, schoolQuals, higherQuals, serviceRecords]);

  // Validation
  const validateStep = useCallback(() => {
    const e = {};
    if (step === 0) {
      if (!data.category) e.category = "Select registration category (Item 1)";
      if (!data.discipline) e.discipline = "Enter discipline/subject (Item 2)";
      if (!data.candidateName) e.candidateName = "Enter candidate name as in degree (Item 3)";
      if (!data.dob) e.dob = "Enter date of birth (Item 4)";
      if (!data.sex) e.sex = "Select sex (Item 5)";
      if (!data.religion) e.religion = "Select religion (Item 6)";
      if (!data.community) e.community = "Select community (Item 7)";
    }
    if (step === 1) {
      if (!data.fatherGuardianDetails) e.fatherGuardianDetails = "Enter father's / guardian's details (Item 9)";
      if (!data.communicationAddress && (!data.street || !data.city)) {
        e.communicationAddress = "Enter communication address with pincode (Item 10)";
      }
      if (data.category === "Part Time" && !data.workingAddress) {
        e.workingAddress = "Working address is required for Part Time candidates (Item 11)";
      }
      if (!data.mobile) e.mobile = "Enter mobile number (Item 14)";
      if (!data.email) e.email = "Enter email address (Item 15)";
      if (!data.idProofNumber) e.idProofNumber = "Enter Aadhaar / Voter ID number (Item 16)";
    }
    if (step === 2) {
      // Academic & service
      if (!data.qualExamType) e.qualExamType = "Select qualifying examination (Item 19)";
    }
    if (step === 3) {
      if (!data.researchDepartment) e.researchDepartment = "Specify research department/centre (Item 23)";
      if (!data.broadTopic) e.broadTopic = "Enter broad research topic (Item 25)";
      if (!data.supervisorName) e.supervisorName = "Enter research supervisor name (Item 26)";
    }
    if (step === 4) {
      if (!data.paymentDetails?.receiptNo) e.receiptNo = "Enter DD / Transaction receipt number (Item 30)";
      if (!data.declarationAccepted) e.declarationAccepted = "You must accept the declaration";
      if (!signature) e.signature = "Candidate signature is required";
    }

    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error(Object.values(e)[0]);
    }
    return Object.keys(e).length === 0;
  }, [step, data, signature]);

  const goNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const token = sessionStorage.getItem("rms_token");
      const fullAddress = data.communicationAddress || `${data.street}, ${data.city}, ${data.district}, ${data.state} - ${data.pincode}`;
      const payload = {
        testAccountId: user.testAccountId || user.id,
        formData: {
          ...data,
          fullName: data.candidateName,
          name: data.candidateName,
          subject: data.discipline,
          mobile1: data.mobile,
          address: fullAddress,
          researchTitle: data.broadTopic,
          guide: data.supervisorName,
          schoolQuals,
          higherQuals,
          serviceRecords,
          signature,
        },
      };

      const res = await apiFetch("/api/test-accounts/submit-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Submission failed");
      toast.success("Application (Items 1 to 30) submitted successfully!");
      setSubmissionStatus("Pending");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF6EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: "#8A8375" }}>Loading registration application...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--parchment)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--ink)" }}>
      <style>{`
        :root {
          --ink: #232323;
          --oxblood: #6B1F2A;
          --oxblood-deep: #4E1620;
          --parchment: #FAF6EC;
          --parchment-line: #E4DAC2;
          --brass: #A9823E;
          --sage: #4C6B58;
          --rust: #A34A28;
          --font-display: Georgia, 'Times New Roman', serif;
          --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --font-mono: 'Courier New', ui-monospace, monospace;
        }
        .field-underline {
          display: block;
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #C9BFA3;
          padding: 6px 2px;
          font-size: 14px;
          color: var(--ink);
          font-family: var(--font-body);
          outline: none;
          transition: border-color .15s;
          box-sizing: border-box;
        }
        .field-underline:focus { border-bottom: 1.5px solid var(--oxblood); }
        .field-underline::placeholder { color: #B4AC98; }
        .segmented-btn {
          padding: 5px 14px;
          font-size: 12.5px;
          border: 1px solid #C9BFA3;
          background: transparent;
          color: var(--ink);
          border-radius: 999px;
          cursor: pointer;
          transition: all .15s;
        }
        .segmented-btn:hover { border-color: var(--oxblood); }
        .tab-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          cursor: pointer;
          border-left: 3px solid transparent;
          color: #8A8375;
          font-size: 12.5px;
          transition: all .15s;
        }
        .tab-item.active {
          border-left: 3px solid var(--oxblood);
          background: #FFFDF7;
          color: var(--oxblood-deep);
          font-weight: 600;
        }
        .tab-item.done { color: var(--sage); }
        .ruled {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 34px,
            var(--parchment-line) 34px,
            var(--parchment-line) 35px
          );
        }
        .btn-primary {
          background: var(--oxblood);
          color: #FBF3E7;
          border: none;
          padding: 10px 22px;
          font-size: 14px;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-primary:hover { background: var(--oxblood-deep); }
        .btn-ghost {
          background: transparent;
          color: var(--ink);
          border: 1px solid #C9BFA3;
          padding: 10px 20px;
          font-size: 14px;
          border-radius: 3px;
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: var(--oxblood); }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 20px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0 16px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
          margin: 8px 0 14px;
        }
        .data-table th {
          background: #F4EEDC;
          border: 1px solid var(--parchment-line);
          padding: 6px 8px;
          font-weight: 600;
          text-align: left;
          color: var(--oxblood-deep);
        }
        .data-table td {
          border: 1px solid var(--parchment-line);
          padding: 4px 6px;
          background: #FFFDF7;
        }
        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--parchment-line)", background: "#FFFDF7" }}>
        <div style={{ maxWidth: 1050, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "1.5px solid var(--brass)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              color: "var(--brass)",
              fontSize: 16,
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            BDU
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--oxblood-deep)", fontWeight: "bold", letterSpacing: 0.3 }}>
              BHARATHIDASAN UNIVERSITY, TIRUCHIRAPPALLI – 24
            </div>
            <div style={{ fontSize: 12, color: "#6B1F2A", fontWeight: 600 }}>
              APPLICATION FORM FOR ADMISSION AND PROVISIONAL REGISTRATION FOR THE DEGREE OF Ph.D
            </div>
            <div style={{ fontSize: 11.5, color: "#8A8375" }}>
              Research Centre: St. Joseph's College (Autonomous), Tiruchirappalli (Affiliated to Bharathidasan University)
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#8A8375", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
              {savedAt ? `saved ${savedAt.toLocaleTimeString()}` : "saving..."}
            </div>
            <button onClick={handleLogout} style={{
              background: "none", border: "1px solid #C9BFA3", borderRadius: 4,
              padding: "3px 10px", fontSize: 12, color: "var(--oxblood)", cursor: "pointer"
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1050, margin: "0 auto", padding: "20px 16px", display: "flex", gap: 20 }}>
        {/* Left index-tab stepper */}
        <div style={{ width: 195, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 20 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "3px solid var(--parchment-line)",
                borderTopColor: "var(--brass)",
                transform: `rotate(${progressPct * 3.6}deg)`,
                margin: "0 0 12px 14px",
                position: "relative",
              }}
              aria-hidden="true"
            />
            <div style={{ fontSize: 11, color: "#8A8375", marginLeft: 14, marginTop: -6, marginBottom: 12 }}>
              {progressPct}% completed
            </div>
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={"tab-item" + (i === step ? " active" : i < step ? " done" : "")}
                onClick={() => { if (i <= step || submissionStatus) setStep(i); }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  {i < step ? "✓" : String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Form panel or Status Screen */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ruled" style={{ background: "#FFFDF7", border: "1px solid var(--parchment-line)", borderRadius: 4, padding: "26px 30px" }}>
            {submissionStatus ? (
              <StatusScreen status={submissionStatus} rejectionReason={rejectionReason} onLogout={handleLogout} formData={data} />
            ) : (
              <>
                {/* ----------------- STEP 1: ITEMS 1 TO 8 ----------------- */}
                {step === 0 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--oxblood)", fontWeight: "bold" }}>
                          Information to be Provided by the Candidate
                        </div>
                        <div style={{ fontSize: 12, color: "#8A8375" }}>
                          Items 1 to 8: Candidate Category, Subject &amp; Personal Profile
                        </div>
                      </div>

                      {/* Photo Upload Thumbnail Box */}
                      <div style={{ textAlign: "center" }}>
                        <div style={{
                          width: 84, height: 100, border: "1.5px dashed #C9BFA3",
                          borderRadius: 4, background: "#FAF6EC", display: "flex",
                          alignItems: "center", justifyContent: "center", overflow: "hidden",
                          marginBottom: 4, position: "relative"
                        }}>
                          {data.photo ? (
                            <img src={data.photo} alt="Scholar Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ fontSize: 10, color: "#8A8375", textAlign: "center", padding: 4 }}>
                              Photo (Optional)
                            </span>
                          )}
                        </div>
                        <label style={{ fontSize: 11, color: "var(--oxblood)", cursor: "pointer", textDecoration: "underline" }}>
                          {data.photo ? "Change" : "Upload"}
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                        </label>
                      </div>
                    </div>

                    {/* 1. Category */}
                    <Field label="Category under which registration is sought" number="1" required error={errors.category}>
                      <Segmented
                        options={["Full Time", "Part Time"]}
                        value={data.category}
                        onChange={set("category")}
                      />
                    </Field>

                    {/* 2. Discipline / Subject */}
                    <Field label="Discipline / Subject which registration is sought" number="2" required error={errors.discipline}>
                      <TextInput
                        placeholder="e.g. Computer Science / Physics / Commerce"
                        value={data.discipline}
                        onChange={set("discipline")}
                      />
                    </Field>

                    {/* 3. Name of Candidate */}
                    <Field label="Name of the Candidate (as entered in Degree Certificate)" number="3" required error={errors.candidateName}>
                      <TextInput
                        placeholder="Candidate Full Name in CAPITAL LETTERS"
                        value={data.candidateName}
                        onChange={set("candidateName")}
                      />
                    </Field>

                    {/* 4. Date of Birth & Age */}
                    <div className="grid-2">
                      <Field label="Date of Birth" number="4" required error={errors.dob}>
                        <TextInput
                          type="date"
                          value={data.dob}
                          onChange={set("dob")}
                        />
                      </Field>
                      <Field label="Age (in completed years)" hint="Calculated automatically">
                        <TextInput
                          type="number"
                          placeholder="e.g. 25"
                          value={data.age}
                          onChange={set("age")}
                        />
                      </Field>
                    </div>

                    {/* 5. Sex */}
                    <Field label="Sex" number="5" required error={errors.sex}>
                      <Segmented
                        options={["Male", "Female", "Other"]}
                        value={data.sex}
                        onChange={set("sex")}
                      />
                    </Field>

                    {/* 6. Nationality / Religion */}
                    <div className="grid-2">
                      <Field label="Nationality" number="6" required>
                        <TextInput
                          placeholder="e.g. Indian"
                          value={data.nationality}
                          onChange={set("nationality")}
                        />
                      </Field>
                      <Field label="Religion" required error={errors.religion}>
                        <Segmented
                          options={RELIGIONS}
                          value={data.religion}
                          onChange={set("religion")}
                        />
                      </Field>
                    </div>

                    {data.religion === "Christian" && (
                      <div className="grid-2" style={{ background: "#FAF6EC", padding: "10px 14px", borderRadius: 4, marginBottom: 16, border: "1px solid var(--parchment-line)" }}>
                        <Field label="If Christian">
                          <Segmented
                            options={["Catholic", "Non-Catholic"]}
                            value={data.christianDenom}
                            onChange={set("christianDenom")}
                          />
                        </Field>
                        <Field label="Christian cluster">
                          <Segmented
                            options={["Dalit", "Non-Dalit"]}
                            value={data.christianCluster}
                            onChange={set("christianCluster")}
                          />
                        </Field>
                      </div>
                    )}

                    {/* 7. Community */}
                    <Field label="Community" number="7" required error={errors.community}>
                      <Segmented
                        options={COMMUNITIES}
                        value={data.community}
                        onChange={set("community")}
                      />
                    </Field>

                    {/* 8. Physically or Visually Challenged */}
                    <div className="grid-2">
                      <Field label="Physically or Visually Challenged" number="8" required>
                        <Segmented
                          options={["No", "Yes"]}
                          value={data.physicallyChallenged}
                          onChange={set("physicallyChallenged")}
                        />
                      </Field>
                      {data.physicallyChallenged === "Yes" && (
                        <Field label="Details / Percentage of Disability">
                          <TextInput
                            placeholder="e.g. Orthopedically challenged 40%"
                            value={data.physicallyChallengedDetails}
                            onChange={set("physicallyChallengedDetails")}
                          />
                        </Field>
                      )}
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 2: ITEMS 9 TO 17 ----------------- */}
                {step === 1 && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--oxblood)", fontWeight: "bold" }}>
                        Address, Contact &amp; Identification Details
                      </div>
                      <div style={{ fontSize: 12, color: "#8A8375" }}>
                        Items 9 to 17: Official communication addresses, contact numbers &amp; ID proof
                      </div>
                    </div>

                    {/* 9. Father's / Guardian's Name & Address */}
                    <Field label="Father’s / Guardian’s Name & Address" number="9" required error={errors.fatherGuardianDetails}>
                      <TextArea
                        placeholder="Enter Father's / Guardian's Full Name, Door No, Street, City & Pincode"
                        value={data.fatherGuardianDetails}
                        onChange={set("fatherGuardianDetails")}
                      />
                    </Field>

                    {/* 10. Address to which Communication to be sent */}
                    <Field label="Address to which Communication to be sent (with Pincode)" number="10" required error={errors.communicationAddress}>
                      <TextArea
                        placeholder="Street / Door No, Area, City, District, State with PINCODE"
                        value={data.communicationAddress}
                        onChange={set("communicationAddress")}
                      />
                    </Field>

                    <div className="grid-2">
                      <Field label="City / Town">
                        <TextInput value={data.city} onChange={set("city")} placeholder="e.g. Tiruchirappalli" />
                      </Field>
                      <Field label="Pincode" required>
                        <TextInput value={data.pincode} onChange={set("pincode")} placeholder="6-digit Pincode" />
                      </Field>
                    </div>

                    {/* 11. If Part Time Candidate (Working Address) */}
                    <Field
                      label="If Part Time Candidate (Working Address)"
                      number="11"
                      required={data.category === "Part Time"}
                      error={errors.workingAddress}
                      hint={data.category === "Part Time" ? "Mandatory for Part-Time candidates" : "Optional for Full-Time candidates"}
                    >
                      <TextArea
                        placeholder="Institution / Company Name, Department, Official Address with Pincode"
                        value={data.workingAddress}
                        onChange={set("workingAddress")}
                      />
                    </Field>

                    {/* Contact details grid: 12, 13, 14, 15 */}
                    <div className="grid-2">
                      {/* 12. Phone Number */}
                      <Field label="Phone Number (Landline / Res.)" number="12">
                        <TextInput
                          placeholder="e.g. 0431-2700320"
                          value={data.phone}
                          onChange={set("phone")}
                        />
                      </Field>

                      {/* 13. FAX */}
                      <Field label="FAX Number" number="13">
                        <TextInput
                          placeholder="Optional"
                          value={data.fax}
                          onChange={set("fax")}
                        />
                      </Field>
                    </div>

                    <div className="grid-2">
                      {/* 14. Mobile Number */}
                      <Field label="Mobile Number" number="14" required error={errors.mobile}>
                        <TextInput
                          placeholder="10-digit primary mobile"
                          value={data.mobile}
                          onChange={set("mobile")}
                        />
                      </Field>

                      {/* 15. E-mail */}
                      <Field label="E-mail Address" number="15" required error={errors.email}>
                        <TextInput
                          type="email"
                          placeholder="candidate@example.com"
                          value={data.email}
                          onChange={set("email")}
                        />
                      </Field>
                    </div>

                    {/* 16. Aadhaar No / Voter ID & 17. Passport */}
                    <div className="grid-2" style={{ marginTop: 6 }}>
                      {/* 16. Aadhaar / Voter ID */}
                      <Field label="Aadhaar No / Voter ID" number="16" required error={errors.idProofNumber}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <select
                            value={data.idProofType}
                            onChange={set("idProofType")}
                            className="field-underline"
                            style={{ width: "35%" }}
                          >
                            <option value="Aadhaar No">Aadhaar No</option>
                            <option value="Voter ID">Voter ID</option>
                          </select>
                          <TextInput
                            placeholder="Enter ID Number"
                            value={data.idProofNumber}
                            onChange={set("idProofNumber")}
                            style={{ flex: 1 }}
                          />
                        </div>
                      </Field>

                      {/* 17. Passport No. & Visa Period */}
                      <Field label="Passport No. & Visa Period (if applicable)" number="17">
                        <div style={{ display: "flex", gap: 8 }}>
                          <TextInput
                            placeholder="Passport No."
                            value={data.passportNo}
                            onChange={set("passportNo")}
                            style={{ width: "50%" }}
                          />
                          <TextInput
                            placeholder="Visa Period"
                            value={data.visaPeriod}
                            onChange={set("visaPeriod")}
                            style={{ width: "50%" }}
                          />
                        </div>
                      </Field>
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 3: ITEMS 18 TO 20 ----------------- */}
                {step === 2 && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--oxblood)", fontWeight: "bold" }}>
                        Educational Qualifications &amp; Service Particulars
                      </div>
                      <div style={{ fontSize: 12, color: "#8A8375" }}>
                        Items 18 to 20: School qualifications, Degree records, PG marks &amp; Service details
                      </div>
                    </div>

                    {/* 18. Educational Qualification */}
                    <SectionHeader number="18" title="Educational Qualification" subtitle="Enter basic school level and higher degree qualifications" />

                    {/* A. School Level Qualifications */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                      A. School Level Qualifications
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: "16%" }}>Course</th>
                            <th style={{ width: "24%" }}>School / Institution</th>
                            <th style={{ width: "16%" }}>Board</th>
                            <th style={{ width: "16%" }}>Degree &amp; Subject</th>
                            <th style={{ width: "10%" }}>% Marks</th>
                            <th style={{ width: "10%" }}>Month &amp; Yr</th>
                            <th style={{ width: "12%" }}>Mode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schoolQuals.map((row, idx) => (
                            <tr key={row.course}>
                              <td style={{ fontWeight: 600 }}>{row.course}</td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="School name"
                                  value={row.school}
                                  onChange={(e) => updateSchoolQual(idx, "school", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="e.g. State Board / CBSE"
                                  value={row.board}
                                  onChange={(e) => updateSchoolQual(idx, "board", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="Subjects studied"
                                  value={row.degreeSubject}
                                  onChange={(e) => updateSchoolQual(idx, "degreeSubject", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="%"
                                  value={row.percentage}
                                  onChange={(e) => updateSchoolQual(idx, "percentage", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="MM/YYYY"
                                  value={row.yearOfPassing}
                                  onChange={(e) => updateSchoolQual(idx, "yearOfPassing", e.target.value)}
                                />
                              </td>
                              <td>
                                <select
                                  className="field-underline"
                                  value={row.studyType}
                                  onChange={(e) => updateSchoolQual(idx, "studyType", e.target.value)}
                                >
                                  {STUDY_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* B. Higher Education (UG, PG, M.Phil) */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 14, marginBottom: 4 }}>
                      B. Higher Education Degree Qualifications
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: "12%" }}>Degree</th>
                            <th style={{ width: "24%" }}>College / Institute</th>
                            <th style={{ width: "20%" }}>University</th>
                            <th style={{ width: "16%" }}>Subjects Studied</th>
                            <th style={{ width: "10%" }}>% Marks</th>
                            <th style={{ width: "10%" }}>Month &amp; Yr</th>
                            <th style={{ width: "12%" }}>Mode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {higherQuals.map((row, idx) => (
                            <tr key={row.degree}>
                              <td style={{ fontWeight: 600 }}>{row.degree}</td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="College attended"
                                  value={row.college}
                                  onChange={(e) => updateHigherQual(idx, "college", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="Affiliated University"
                                  value={row.university}
                                  onChange={(e) => updateHigherQual(idx, "university", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="e.g. Computer Science"
                                  value={row.subjectsStudied}
                                  onChange={(e) => updateHigherQual(idx, "subjectsStudied", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="%"
                                  value={row.percentage}
                                  onChange={(e) => updateHigherQual(idx, "percentage", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className="field-underline"
                                  placeholder="MM/YYYY"
                                  value={row.yearOfPassing}
                                  onChange={(e) => updateHigherQual(idx, "yearOfPassing", e.target.value)}
                                />
                              </td>
                              <td>
                                <select
                                  className="field-underline"
                                  value={row.studyType}
                                  onChange={(e) => updateHigherQual(idx, "studyType", e.target.value)}
                                >
                                  {STUDY_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* C. Marks / Grades obtained in Post Graduate Programme */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 14, marginBottom: 4 }}>
                      C. Marks / Grades obtained in Post Graduate Programme
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Total Marks Obtained</th>
                            <th>Total Maximum Marks</th>
                            <th>Percentage of Marks</th>
                            <th>Class Obtained</th>
                            <th>CGPA</th>
                            <th>Overall Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                className="field-underline"
                                placeholder="e.g. 1850"
                                value={data.pgGrades?.totalMarksObtained || ""}
                                onChange={setNested("pgGrades", "totalMarksObtained")}
                              />
                            </td>
                            <td>
                              <input
                                className="field-underline"
                                placeholder="e.g. 2400"
                                value={data.pgGrades?.totalMaxMarks || ""}
                                onChange={setNested("pgGrades", "totalMaxMarks")}
                              />
                            </td>
                            <td>
                              <input
                                className="field-underline"
                                placeholder="e.g. 77.08%"
                                value={data.pgGrades?.percentageMarks || ""}
                                onChange={setNested("pgGrades", "percentageMarks")}
                              />
                            </td>
                            <td>
                              <input
                                className="field-underline"
                                placeholder="e.g. First Class"
                                value={data.pgGrades?.classObtained || ""}
                                onChange={setNested("pgGrades", "classObtained")}
                              />
                            </td>
                            <td>
                              <input
                                className="field-underline"
                                placeholder="e.g. 8.2"
                                value={data.pgGrades?.cgpa || ""}
                                onChange={setNested("pgGrades", "cgpa")}
                              />
                            </td>
                            <td>
                              <input
                                className="field-underline"
                                placeholder="e.g. A+"
                                value={data.pgGrades?.overallGrade || ""}
                                onChange={setNested("pgGrades", "overallGrade")}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 19. Ph.D. Registration Qualifying Exam */}
                    <div style={{ marginTop: 22 }}>
                      <SectionHeader number="19" title="Ph.D. Registration Qualifying Examination" subtitle="NET / SET / GATE / UGC–CSIR / University Exam" />
                      <div className="grid-2">
                        <Field label="Qualifying Examination" required error={errors.qualExamType}>
                          <select
                            className="field-underline"
                            value={data.qualExamType}
                            onChange={set("qualExamType")}
                          >
                            {QUAL_EXAMS.map((e) => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </Field>
                        {data.qualExamType === "Other" && (
                          <Field label="Specify Examination Name">
                            <TextInput
                              placeholder="Name of qualifying exam"
                              value={data.qualExamOtherName}
                              onChange={set("qualExamOtherName")}
                            />
                          </Field>
                        )}
                      </div>

                      <div className="grid-2">
                        <Field label="Registration Number / Roll No">
                          <TextInput
                            placeholder="e.g. 21CS0498"
                            value={data.qualExamRegNo}
                            onChange={set("qualExamRegNo")}
                          />
                        </Field>
                        <Field label="Month &amp; Year of Passing">
                          <TextInput
                            placeholder="e.g. JUNE 2023"
                            value={data.qualExamMonthYear}
                            onChange={set("qualExamMonthYear")}
                          />
                        </Field>
                      </div>
                    </div>

                    {/* 20. Particular of Service for Part-Time Candidates */}
                    <div style={{ marginTop: 22 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <SectionHeader
                          number="20"
                          title="Particular of Service for Part - Time Candidates"
                          subtitle="Starting from first appointment (Leave empty if applying Full-Time)"
                        />
                        <button
                          type="button"
                          onClick={addServiceRow}
                          className="text-xs"
                          style={{ color: "var(--oxblood)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                        >
                          + Add Experience Row
                        </button>
                      </div>

                      <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th style={{ width: "20%" }}>Designation</th>
                              <th style={{ width: "12%" }}>From</th>
                              <th style={{ width: "12%" }}>To</th>
                              <th style={{ width: "28%" }}>Institution / Organization</th>
                              <th style={{ width: "20%" }}>Org. Email</th>
                              <th style={{ width: "8%" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {serviceRecords.map((r) => (
                              <tr key={r.id}>
                                <td>
                                  <input
                                    className="field-underline"
                                    placeholder="e.g. Asst. Professor"
                                    value={r.designation}
                                    onChange={(e) => updateServiceRecord(r.id, "designation", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="field-underline"
                                    placeholder="YYYY-MM"
                                    value={r.from}
                                    onChange={(e) => updateServiceRecord(r.id, "from", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="field-underline"
                                    placeholder="YYYY-MM or Present"
                                    value={r.to}
                                    onChange={(e) => updateServiceRecord(r.id, "to", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="field-underline"
                                    placeholder="College / Company"
                                    value={r.institution}
                                    onChange={(e) => updateServiceRecord(r.id, "institution", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="field-underline"
                                    placeholder="org@univ.ac.in"
                                    value={r.email}
                                    onChange={(e) => updateServiceRecord(r.id, "email", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => removeServiceRow(r.id)}
                                    style={{ color: "var(--rust)", background: "none", border: "none", cursor: "pointer", fontSize: 11 }}
                                  >
                                    remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ maxWidth: 300 }}>
                        <Field label="Total Service (in Years)">
                          <TextInput
                            placeholder="e.g. 3 Years 6 Months"
                            value={data.totalServiceYears}
                            onChange={set("totalServiceYears")}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 4: ITEMS 21 TO 29 ----------------- */}
                {step === 3 && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--oxblood)", fontWeight: "bold" }}>
                        Research, Fellowship &amp; Supervisor Details
                      </div>
                      <div style={{ fontSize: 12, color: "#8A8375" }}>
                        Items 21 to 29: Fellowship, Research Centre, Proposed Topic &amp; Research Supervisor info
                      </div>
                    </div>

                    {/* 21. Whether Candidate awarded fellowship */}
                    <Field label="Whether the Candidate awarded any fellowship" number="21" required>
                      <Segmented
                        options={["No", "Yes"]}
                        value={data.fellowshipAwarded}
                        onChange={set("fellowshipAwarded")}
                      />
                    </Field>

                    {/* 22. Fellowship details */}
                    {data.fellowshipAwarded === "Yes" && (
                      <div style={{ background: "#FAF6EC", padding: "14px 16px", borderRadius: 4, marginBottom: 18, border: "1px solid var(--parchment-line)" }}>
                        <SectionHeader number="22" title="Fellowship Sponsorship Details" />
                        <Field label="Name of Sponsor & Address">
                          <TextInput
                            placeholder="e.g. CSIR / DST INSPIRE / UGC JRF"
                            value={data.fellowshipSponsor}
                            onChange={set("fellowshipSponsor")}
                          />
                        </Field>
                        <div className="grid-2">
                          <Field label="Fellowship Amount (₹ / Month)">
                            <TextInput
                              placeholder="e.g. ₹37,000 + HRA"
                              value={data.fellowshipAmount}
                              onChange={set("fellowshipAmount")}
                            />
                          </Field>
                          <Field label="Period of Fellowship">
                            <TextInput
                              placeholder="e.g. 3 Years (2024 - 2027)"
                              value={data.fellowshipPeriod}
                              onChange={set("fellowshipPeriod")}
                            />
                          </Field>
                        </div>
                      </div>
                    )}

                    {/* 23. Place where admission is sought */}
                    <Field
                      label="Name & Address of the Department / College where admission is sought to Conduct research"
                      number="23"
                      required
                      error={errors.researchDepartment}
                    >
                      <TextArea
                        placeholder="Department name and College address"
                        value={data.researchDepartment}
                        onChange={set("researchDepartment")}
                      />
                    </Field>

                    {/* 24. Interdisciplinary */}
                    <div className="grid-2">
                      <Field label="Whether registration is sought in interdisciplinary area" number="24" required>
                        <Segmented
                          options={["No", "Yes"]}
                          value={data.isInterdisciplinary}
                          onChange={set("isInterdisciplinary")}
                        />
                      </Field>
                      {data.isInterdisciplinary === "Yes" && (
                        <Field label="Area in addition to your PG degree">
                          <TextInput
                            placeholder="e.g. Bioinformatics / Cognitive AI"
                            value={data.interdisciplinaryArea}
                            onChange={set("interdisciplinaryArea")}
                          />
                        </Field>
                      )}
                    </div>

                    {/* 25. Broad Topic */}
                    <Field label="Broad Topic of Research / Tentative Title" number="25" required error={errors.broadTopic}>
                      <TextInput
                        placeholder="e.g. Deep Learning Approaches for Early Detection of Plant Pathologies"
                        value={data.broadTopic}
                        onChange={set("broadTopic")}
                      />
                    </Field>

                    {/* 26. Supervisor / Guide */}
                    <SectionHeader number="26" title="Name, Address & Date of Super-annuation of Supervisor / Guide" />
                    <Field label="Research Supervisor / Guide Name" required error={errors.supervisorName}>
                      <TextInput
                        placeholder="Dr. Full Name, Associate Professor / Professor"
                        value={data.supervisorName}
                        onChange={set("supervisorName")}
                      />
                    </Field>
                    <div className="grid-2">
                      <Field label="Supervisor Working Address & Department">
                        <TextInput
                          placeholder="Department of Computer Science, St. Joseph's College"
                          value={data.supervisorAddress}
                          onChange={set("supervisorAddress")}
                        />
                      </Field>
                      <Field label="Date of Super-annuation of Guide">
                        <TextInput
                          type="date"
                          value={data.supervisorSuperannuation}
                          onChange={set("supervisorSuperannuation")}
                        />
                      </Field>
                    </div>

                    {/* 27. Total Scholars under supervisor */}
                    <SectionHeader number="27" title="Total number of Ph.D. Scholars working under the Supervisor" />
                    <div className="grid-2">
                      <Field label="Full - Time Scholars Count">
                        <TextInput
                          type="number"
                          placeholder="0"
                          value={data.supervisorScholarsFullTime}
                          onChange={set("supervisorScholarsFullTime")}
                        />
                      </Field>
                      <Field label="Part - Time Scholars Count">
                        <TextInput
                          type="number"
                          placeholder="0"
                          value={data.supervisorScholarsPartTime}
                          onChange={set("supervisorScholarsPartTime")}
                        />
                      </Field>
                    </div>

                    {/* 28 & 29. Co-Supervisor details */}
                    <div className="grid-2" style={{ marginTop: 10 }}>
                      <div>
                        <SectionHeader number="28" title="Co-Supervisor (for Inter-disciplinary)" />
                        <Field label="Name & Address of Co-Guide">
                          <TextInput
                            placeholder="Optional co-supervisor name"
                            value={data.coSupervisorInterdisciplinary?.name || ""}
                            onChange={(e) =>
                              setData((d) => ({
                                ...d,
                                coSupervisorInterdisciplinary: {
                                  ...d.coSupervisorInterdisciplinary,
                                  name: e.target.value,
                                },
                              }))
                            }
                          />
                        </Field>
                      </div>
                      <div>
                        <SectionHeader number="29" title="Co-Supervisor (for Part-Time)" />
                        <Field label="Name & Address of Co-Guide (Part-Time)">
                          <TextInput
                            placeholder="Optional external co-guide"
                            value={data.coSupervisorPartTime?.name || ""}
                            onChange={(e) =>
                              setData((d) => ({
                                ...d,
                                coSupervisorPartTime: {
                                  ...d.coSupervisorPartTime,
                                  name: e.target.value,
                                },
                              }))
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 5: ITEM 30 & DECLARATION ----------------- */}
                {step === 4 && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--oxblood)", fontWeight: "bold" }}>
                        Payment Details &amp; Undertaking
                      </div>
                      <div style={{ fontSize: 12, color: "#8A8375" }}>
                        Item 30: Registration fee remittance &amp; Candidate Declaration with Signature
                      </div>
                    </div>

                    {/* 30. Payment Details */}
                    <SectionHeader number="30" title="Payment Details" subtitle="Registration / Admission application fee remittance info" />
                    <div className="grid-2">
                      <Field label="DD No / Online Transaction / Receipt No" required error={errors.receiptNo}>
                        <TextInput
                          placeholder="e.g. SJC-REG-2026-8941 or SBI10293847"
                          value={data.paymentDetails?.receiptNo || ""}
                          onChange={setNested("paymentDetails", "receiptNo")}
                        />
                      </Field>
                      <Field label="DD / Online Transaction Date" required>
                        <TextInput
                          type="date"
                          value={data.paymentDetails?.transactionDate || ""}
                          onChange={setNested("paymentDetails", "transactionDate")}
                        />
                      </Field>
                    </div>

                    <div className="grid-3">
                      <Field label="DD / Online Amount (₹)" required>
                        <TextInput
                          placeholder="3000"
                          value={data.paymentDetails?.amount || ""}
                          onChange={setNested("paymentDetails", "amount")}
                        />
                      </Field>
                      <Field label="Bank Name" required>
                        <TextInput
                          placeholder="e.g. State Bank of India"
                          value={data.paymentDetails?.bankName || ""}
                          onChange={setNested("paymentDetails", "bankName")}
                        />
                      </Field>
                      <Field label="Branch Name" required>
                        <TextInput
                          placeholder="e.g. Main Branch, Trichy"
                          value={data.paymentDetails?.branchName || ""}
                          onChange={setNested("paymentDetails", "branchName")}
                        />
                      </Field>
                    </div>

                    {/* Declaration */}
                    <div style={{ marginTop: 24, borderTop: "1.5px solid var(--parchment-line)", paddingTop: 18 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--oxblood-deep)", fontWeight: "bold", marginBottom: 8 }}>
                        Declaration by the Candidate
                      </div>
                      <div
                        style={{
                          border: "1px solid var(--parchment-line)",
                          background: "#FAF6EC",
                          padding: "14px 18px",
                          fontSize: 13,
                          lineHeight: 1.7,
                          color: "var(--ink)",
                          marginBottom: 16,
                          fontFamily: "var(--font-display)",
                          fontStyle: "italic",
                          borderRadius: 4,
                        }}
                      >
                        "I declare that all the particulars furnished above in items 1 to 30 are true, complete and correct to the best of my knowledge and belief. I submit that I will abide by the rules and Ph.D regulations of Bharathidasan University and the College."
                      </div>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, marginBottom: 4, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={data.declarationAccepted}
                          onChange={set("declarationAccepted")}
                          style={{ width: 16, height: 16 }}
                        />
                        <span style={{ fontWeight: 600, color: "var(--ink)" }}>I solemnly accept and affirm the declaration above</span>
                      </label>
                      {errors.declarationAccepted && (
                        <div style={{ color: "var(--rust)", fontSize: 12, marginBottom: 16 }}>{errors.declarationAccepted}</div>
                      )}

                      <div style={{ marginTop: 20 }}>
                        <SignaturePad label="Signature of the Applicant" value={signature} onChange={setSignature} />
                        {errors.signature && (
                          <div style={{ color: "var(--rust)", fontSize: 12, marginTop: 6 }}>{errors.signature}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 6: REVIEW ALL 30 ITEMS ----------------- */}
                {step === 5 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--oxblood-deep)", fontWeight: "bold" }}>
                          Review Complete Ph.D Application (Items 1 – 30)
                        </div>
                        <div style={{ fontSize: 12, color: "#8A8375" }}>
                          Verify all particulars before final submission to the Academic Administration.
                        </div>
                      </div>
                      <span className="badge" style={{ background: "#F5EBE6", color: "var(--oxblood)", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                        Ready for Submission
                      </span>
                    </div>

                    {/* Summary List */}
                    <div style={{ borderTop: "1px solid var(--parchment-line)", fontSize: 13 }}>
                      {[
                        ["1. Category", data.category],
                        ["2. Discipline / Subject", data.discipline],
                        ["3. Name of Candidate", data.candidateName],
                        ["4. Date of Birth & Age", `${data.dob || "—"} (${data.age || "—"} Yrs)`],
                        ["5. Sex", data.sex],
                        ["6. Nationality & Religion", `${data.nationality || "Indian"} / ${data.religion || "—"}`],
                        ["7. Community", data.community],
                        ["8. Physically Challenged", `${data.physicallyChallenged || "No"} ${data.physicallyChallengedDetails ? `(${data.physicallyChallengedDetails})` : ""}`],
                        ["9. Father's / Guardian's Info", data.fatherGuardianDetails || "—"],
                        ["10. Communication Address", data.communicationAddress || `${data.street || ""}, ${data.city || ""}, ${data.pincode || ""}`],
                        ["11. Part Time Working Address", data.workingAddress || "N/A"],
                        ["12. Phone (Landline)", data.phone || "—"],
                        ["13. FAX", data.fax || "—"],
                        ["14. Mobile Number", data.mobile],
                        ["15. E-mail Address", data.email],
                        ["16. ID Proof", `${data.idProofType}: ${data.idProofNumber || "—"}`],
                        ["17. Passport / Visa", data.passportNo ? `${data.passportNo} (Visa: ${data.visaPeriod})` : "N/A"],
                        ["18. Educational Qualification", `${higherQuals.filter((q) => q.college).length + schoolQuals.filter((q) => q.school).length} records entered`],
                        ["19. Ph.D Qualifying Exam", `${data.qualExamType} | Reg No: ${data.qualExamRegNo || "—"}`],
                        ["20. Service Particulars", data.totalServiceYears ? `${data.totalServiceYears} Years` : "N/A"],
                        ["21. Fellowship Awarded", data.fellowshipAwarded],
                        ["22. Fellowship Details", data.fellowshipAwarded === "Yes" ? `${data.fellowshipSponsor} (${data.fellowshipAmount})` : "N/A"],
                        ["23. Research Place", data.researchDepartment],
                        ["24. Interdisciplinary Area", data.isInterdisciplinary === "Yes" ? data.interdisciplinaryArea : "No"],
                        ["25. Broad Topic", data.broadTopic],
                        ["26. Research Supervisor", `${data.supervisorName || "—"} (${data.supervisorAddress || "—"})`],
                        ["27. Scholars under Guide", `Full Time: ${data.supervisorScholarsFullTime || 0} | Part Time: ${data.supervisorScholarsPartTime || 0}`],
                        ["28. Co-Guide (Interdisciplinary)", data.coSupervisorInterdisciplinary?.name || "N/A"],
                        ["29. Co-Guide (Part-Time)", data.coSupervisorPartTime?.name || "N/A"],
                        ["30. Payment Details", `Receipt: ${data.paymentDetails?.receiptNo || "—"} | ₹${data.paymentDetails?.amount || "—"} | ${data.paymentDetails?.bankName || "—"}`],
                        ["Applicant Signature", signature ? "✓ Signed" : "Missing"],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--parchment-line)" }}>
                          <span style={{ color: "#8A8375", width: "42%" }}>{k}</span>
                          <span style={{ color: "var(--ink)", fontWeight: 500, textAlign: "right", width: "58%" }}>{v || "—"}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 18, fontSize: 12.5, color: "var(--sage)", background: "#EDF5F0", padding: "10px 14px", borderRadius: 4 }}>
                      ✓ Upon clicking Submit, your application will be routed to the Academic Administration portal for verification and formal approval.
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1.5px solid var(--parchment-line)" }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={goBack}
                    disabled={step === 0}
                    style={step === 0 ? { opacity: 0.4, cursor: "default" } : {}}
                  >
                    Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button type="button" className="btn-primary" onClick={goNext}>
                      Continue to Next Section
                    </button>
                  ) : (
                    <button type="button" className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting Application..." : "Submit Ph.D Application"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

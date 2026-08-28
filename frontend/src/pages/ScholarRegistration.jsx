import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import toast from "react-hot-toast";

const STEPS = [
  { key: "personal", label: "Personal" },
  { key: "contact", label: "Contact" },
  { key: "academic", label: "Academic" },
  { key: "guide", label: "Guide" },
  { key: "declaration", label: "Declaration" },
  { key: "review", label: "Review" },
];

const RELIGIONS = ["Christian", "Hindu", "Muslim", "Others"];
const COMMUNITIES = ["SC", "ST", "BC", "MBC", "OBC", "OC"];
const PROGRAMMES = ["UG", "PG", "M.Phil", "Diploma"];

const emptyQualRow = () => ({
  id: Math.random().toString(36).slice(2),
  programme: "",
  subject: "",
  university: "",
  regNo: "",
  year: "",
  cls: "",
});

function Field({ label, required, children, hint, error }) {
  return (
    <label className="block mb-6">
      <span className="flex items-baseline gap-1 mb-1.5 text-sm" style={{ color: "var(--ink)", fontWeight: 500 }}>
        {label}
        {required && <span style={{ color: "var(--oxblood)" }}>*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="block mt-1 text-xs" style={{ color: "#8A8375" }}>{hint}</span>
      )}
      {error && (
        <span className="block mt-1 text-xs" style={{ color: "var(--rust)" }}>{error}</span>
      )}
    </label>
  );
}

function TextInput(props) {
  return <input {...props} className={"field-underline " + (props.className || "")} />;
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
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
      <div className="flex items-center justify-between mb-1.5" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="text-sm" style={{ color: "var(--ink)", fontWeight: 500 }}>{label}</span>
        <button type="button" onClick={clear} className="text-xs underline" style={{ color: "#8A8375", background: 'none', border: 'none', cursor: 'pointer' }}>
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
      <div className="text-xs mt-1" style={{ color: "#8A8375" }}>sign above with mouse or finger</div>
    </div>
  );
}

/* -- Status Screen (after submission) -- */
function StatusScreen({ status, rejectionReason, onLogout, formData }) {
  const handlePrint = () => {
    const fd = formData || {}
    const printWindow = window.open('', '_blank')
    if (!printWindow) return alert('Please allow popups to download/print PDF');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Approved PhD Registration - ${fd.fullName || fd.name || 'Scholar'}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @page { size: A4; margin: 0; }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt; color: #111; background: #fff;
            padding: 28px 36px; line-height: 1.55;
          }
          .hdr { text-align: center; border-bottom: 3px double #6B1F2A; padding-bottom: 14px; margin-bottom: 18px; }
          .hdr h1 { font-size: 16pt; font-weight: bold; color: #6B1F2A; }
          .hdr p { font-size: 10pt; color: #555; margin-top: 2px; }
          .doc-title {
            font-size: 12pt; font-weight: bold; text-align: center;
            letter-spacing: 1px; text-transform: uppercase;
            background: #6B1F2A; color: #fff; padding: 6px 20px;
            margin: 0 auto 18px; display: block; width: 100%;
          }
          .section { margin-bottom: 14px; }
          .section-title {
            font-size: 10pt; font-weight: bold; text-transform: uppercase;
            color: #6B1F2A; border-bottom: 1.5px solid #A9823E;
            padding-bottom: 3px; margin-bottom: 8px;
          }
          table.info { width: 100%; border-collapse: collapse; }
          table.info td { padding: 5px 8px; font-size: 11pt; vertical-align: top; }
          table.info td.label { font-weight: bold; color: #555; width: 35%; }
          table.info td.value { color: #111; }
          .approved-stamp {
            border: 2px solid #4C6B58; color: #4C6B58; border-radius: 4px;
            padding: 6px 16px; font-weight: bold; font-size: 13pt;
            letter-spacing: 2px; transform: rotate(-3deg); display: inline-block;
          }
        </style>
      </head>
      <body onload="window.print();">
        <div class="hdr">
          <h1>St. Joseph's College (Autonomous), Tiruchirappalli</h1>
          <p>Office of the Director (Research) — Official PhD Registration Document</p>
        </div>
        <div class="doc-title">Approved PhD Application Form</div>
        <div class="section">
          <div class="section-title">I. Personal Information</div>
          <table class="info">
            <tr><td class="label">Full Name:</td><td class="value">${fd.fullName || fd.name || '-'}</td></tr>
            <tr><td class="label">Research Subject:</td><td class="value">${fd.subject || '-'}</td></tr>
            <tr><td class="label">Gender / DOB:</td><td class="value">${fd.gender || '-'} / ${fd.dob || '-'}</td></tr>
            <tr><td class="label">Religion / Community:</td><td class="value">${fd.religion || '-'} (${fd.community || '-'})</td></tr>
            <tr><td class="label">Email / Phone:</td><td class="value">${fd.email || '-'} / ${fd.mobile1 || '-'}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">II. Address</div>
          <table class="info">
            <tr><td class="label">Address:</td><td class="value">${fd.street || fd.address || ''}, ${fd.city || ''}, ${fd.state || ''} - ${fd.pincode || ''}</td></tr>
          </table>
        </div>
        <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: center;">
          <div class="approved-stamp">✓ OFFICIALLY APPROVED</div>
          <div style="text-align: right; font-size: 11pt;">
            <p><strong>Director of Research</strong></p>
            <p style="color: #666; font-size: 9pt; margin-top: 4px;">St. Joseph's College (Autonomous)</p>
          </div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (status === 'Pending') return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h2 style={{ color: "#6B1F2A", margin: '0 0 10px', fontFamily: "Georgia, serif" }}>Registration Submitted!</h2>
      <p style={{ color: "#8A8375", maxWidth: 420, margin: '0 auto 30px', lineHeight: 1.6 }}>
        Your PhD application has been sent to the Admin for review. You will be notified once it is approved.
      </p>
      <div style={{
        background: '#FFFDF7', border: '1px solid #E4DAC2',
        borderRadius: 8, padding: '16px 20px',
        display: 'inline-block', textAlign: 'left', marginBottom: 30,
      }}>
        <div style={{ fontSize: 13, color: '#A9823E', fontWeight: 600, marginBottom: 6 }}>Next Steps:</div>
        <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13, color: '#232323', lineHeight: 1.8 }}>
          <li>Admin reviews your application on the "Accepting Registration" portal</li>
          <li>Upon approval, your official registration is confirmed</li>
          <li>You can download and print your official application PDF below once approved</li>
        </ul>
      </div>
      <br />
      <button onClick={onLogout} style={{
        padding: '10px 28px', background: '#6B1F2A',
        color: '#FBF3E7', border: 'none', borderRadius: 4,
        fontWeight: 500, fontSize: 14, cursor: 'pointer',
      }}>
        Logout
      </button>
    </div>
  )

  if (status === 'Approved') return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: "#4C6B58", margin: '0 0 10px', fontFamily: "Georgia, serif" }}>Registration Approved!</h2>
      <p style={{ color: "#8A8375", maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
        Congratulations! Your PhD registration has been officially approved by the Academic Administration.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={handlePrint} style={{
          padding: '10px 24px', background: '#4C6B58',
          color: '#fff', border: 'none', borderRadius: 4,
          fontWeight: 600, fontSize: 14, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8
        }}>
          📄 Download Application PDF
        </button>
        <button onClick={onLogout} style={{
          padding: '10px 24px', background: '#6B1F2A',
          color: '#FBF3E7', border: 'none', borderRadius: 4,
          fontWeight: 500, fontSize: 14, cursor: 'pointer',
        }}>
          Logout
        </button>
      </div>
    </div>
  )

  if (status === 'Rejected') return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
      <h2 style={{ color: "#A34A28", margin: '0 0 10px', fontFamily: "Georgia, serif" }}>Registration Not Accepted</h2>
      {rejectionReason && (
        <div style={{
          background: '#FFFDF7', border: '1px solid #A34A28',
          borderRadius: 8, padding: '14px 20px', maxWidth: 420,
          margin: '0 auto 20px', textAlign: 'left',
        }}>
          <div style={{ fontWeight: 600, color: '#A34A28', marginBottom: 4 }}>Reason:</div>
          <div style={{ color: '#232323', fontSize: 14 }}>{rejectionReason}</div>
        </div>
      )}
      <p style={{ color: "#8A8375", marginBottom: 20 }}>Please contact the Admin for further assistance.</p>
      <button onClick={onLogout} style={{
        padding: '10px 28px', background: '#6B1F2A',
        color: '#FBF3E7', border: 'none', borderRadius: 4,
        fontWeight: 500, fontSize: 14, cursor: 'pointer',
      }}>
        Logout
      </button>
    </div>
  )

  return null
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

  const [data, setData] = useState({
    subject: "",
    fullName: "",
    gender: "",
    dob: "",
    religion: "",
    christianDenom: "",
    christianCluster: "",
    community: "",
    email: "",
    mobile1: "",
    mobile2: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    lastCollege: "",
    lastUniversity: "",
    working: false,
    institutionName: "",
    guide: "",
    coGuide: "",
    declarationAccepted: false,
  });

  const [quals, setQuals] = useState([emptyQualRow()]);
  const [signature, setSignature] = useState(null);

  // If not a test account user, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (!user.isTestAccount) {
      navigate(`/${user.role?.toLowerCase() || 'login'}`, { replace: true });
      return;
    }

    // Pre-fill user data
    setData(d => ({
      ...d,
      fullName: user.name || d.fullName,
      email: user.email || d.email,
    }));

    fetchMyRegistration();
  }, [user]);

  const fetchMyRegistration = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rms_token');
      const res = await apiFetch('/api/test-accounts/my-registration', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = await res.json();
      if (resData?.data) {
        setSubmissionStatus(resData.data.status);
        setRejectionReason(resData.data.rejectionReason || '');
        if (resData.data.formData) {
          setData(d => ({ ...d, ...resData.data.formData }));
          if (resData.data.formData.quals) setQuals(resData.data.formData.quals);
          if (resData.data.formData.signature) setSignature(resData.data.formData.signature);
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

  const updateQual = (id, key, val) => {
    setQuals((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  };
  const addQual = () => setQuals((rows) => [...rows, emptyQualRow()]);
  const removeQual = (id) => setQuals((rows) => (rows.length > 1 ? rows.filter((r) => r.id !== id) : rows));

  // autosave simulation
  useEffect(() => {
    const t = setTimeout(() => setSavedAt(new Date()), 700);
    return () => clearTimeout(t);
  }, [data, quals]);

  const validateStep = useCallback(() => {
    const e = {};
    if (step === 0) {
      if (!data.fullName) e.fullName = "Enter your full name";
      if (!data.subject) e.subject = "Enter research subject";
      if (!data.dob) e.dob = "Enter date of birth";
      if (!data.gender) e.gender = "Select sex";
      if (!data.religion) e.religion = "Select religion";
      if (!data.community) e.community = "Select community";
    }
    if (step === 1) {
      if (!data.email) e.email = "Enter email";
      if (!data.mobile1) e.mobile1 = "Enter a mobile number";
      if (!data.street || !data.city) e.street = "Enter address for communication";
    }
    if (step === 4) {
      if (!data.declarationAccepted) e.declarationAccepted = "You must accept the declaration";
      if (!signature) e.signature = "Signature required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, data, signature]);

  const goNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('rms_token');
      const res = await apiFetch('/api/test-accounts/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testAccountId: user.testAccountId || user.id,
          formData: {
            ...data,
            name: data.fullName,
            address: `${data.street}, ${data.city}, ${data.district}, ${data.state} - ${data.pincode}`,
            quals,
            signature,
          },
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Submission failed');
      toast.success('Application submitted successfully!');
      setSubmissionStatus('Pending');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF6EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: "#8A8375" }}>Loading your registration...</div>
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
          --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --font-mono: 'Courier New', ui-monospace, monospace;
        }
        .field-underline {
          display: block;
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #C9BFA3;
          padding: 6px 2px;
          font-size: 14.5px;
          color: var(--ink);
          font-family: var(--font-body);
          outline: none;
          transition: border-color .15s;
          box-sizing: border-box;
        }
        .field-underline:focus { border-bottom: 1.5px solid var(--oxblood); }
        .field-underline::placeholder { color: #B4AC98; }
        .segmented-btn {
          padding: 6px 14px;
          font-size: 13px;
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
          gap: 10px;
          padding: 12px 16px 12px 18px;
          cursor: pointer;
          border-left: 3px solid transparent;
          color: #8A8375;
          font-size: 13.5px;
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
          gap: 0 24px;
        }
        @media (max-width: 640px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--parchment-line)", background: "#FFFDF7" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              border: "1.5px solid var(--brass)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              color: "var(--brass)",
              fontSize: 15,
              letterSpacing: 1,
              flexShrink: 0,
            }}
          >
            SJC
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--oxblood-deep)", fontWeight: "bold" }}>
              PhD Admission &amp; Registration
            </div>
            <div style={{ fontSize: 12.5, color: "#8A8375" }}>
              St. Joseph's College (Autonomous), Tiruchirappalli — Full-Time / Part-Time Programme
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11.5, color: "#8A8375", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
              {savedAt ? `draft saved ${savedAt.toLocaleTimeString()}` : "saving..."}
            </div>
            <button onClick={handleLogout} style={{
              background: 'none', border: '1px solid #C9BFA3', borderRadius: 4,
              padding: '3px 10px', fontSize: 12, color: 'var(--oxblood)', cursor: 'pointer'
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px", display: "flex", gap: 24 }}>
        {/* Left index-tab stepper */}
        <div style={{ width: 180, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 24 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "3px solid var(--parchment-line)",
                borderTopColor: "var(--brass)",
                transform: `rotate(${progressPct * 3.6}deg)`,
                margin: "0 0 16px 18px",
                position: "relative",
              }}
              aria-hidden="true"
            />
            <div style={{ fontSize: 11, color: "#8A8375", marginLeft: 18, marginTop: -10, marginBottom: 14 }}>
              {progressPct}% complete
            </div>
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={"tab-item" + (i === step ? " active" : i < step ? " done" : "")}
                onClick={() => { if (i <= step || submissionStatus) setStep(i); }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Form panel or Status Screen */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ruled" style={{ background: "#FFFDF7", border: "1px solid var(--parchment-line)", borderRadius: 2, padding: "28px 32px" }}>
            {submissionStatus ? (
              <StatusScreen status={submissionStatus} rejectionReason={rejectionReason} onLogout={handleLogout} formData={data} />
            ) : (
              <>
                {step === 0 && (
                  <div>
                    <Field label="Research subject" required error={errors.subject}>
                      <TextInput placeholder="e.g. Computer Science" value={data.subject} onChange={set("subject")} />
                    </Field>
                    <Field label="Name" required error={errors.fullName}>
                      <TextInput placeholder="Full name as per certificates" value={data.fullName} onChange={set("fullName")} />
                    </Field>
                    <div className="grid-2">
                      <Field label="Sex" required error={errors.gender}>
                        <Segmented options={["Male", "Female", "Other"]} value={data.gender} onChange={set("gender")} />
                      </Field>
                      <Field label="Date of birth" required error={errors.dob}>
                        <TextInput type="date" value={data.dob} onChange={set("dob")} />
                      </Field>
                    </div>
                    <Field label="Religion" required error={errors.religion}>
                      <Segmented options={RELIGIONS} value={data.religion} onChange={set("religion")} />
                    </Field>
                    {data.religion === "Christian" && (
                      <div className="grid-2">
                        <Field label="If Christian">
                          <Segmented options={["Catholic", "Non-Catholic"]} value={data.christianDenom} onChange={set("christianDenom")} />
                        </Field>
                        <Field label="Christian cluster">
                          <Segmented options={["Dalit", "Non-Dalit"]} value={data.christianCluster} onChange={set("christianCluster")} />
                        </Field>
                      </div>
                    )}
                    <Field label="Community" required error={errors.community}>
                      <Segmented options={COMMUNITIES} value={data.community} onChange={set("community")} />
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <Field label="Mail ID" required error={errors.email}>
                      <TextInput type="email" placeholder="name@example.com" value={data.email} onChange={set("email")} />
                    </Field>
                    <div className="grid-2">
                      <Field label="Mobile number" required error={errors.mobile1}>
                        <TextInput placeholder="10-digit number" value={data.mobile1} onChange={set("mobile1")} />
                      </Field>
                      <Field label="Mobile number (alt.)">
                        <TextInput placeholder="optional" value={data.mobile2} onChange={set("mobile2")} />
                      </Field>
                    </div>
                    <Field label="Address for communication" required error={errors.street}>
                      <TextInput placeholder="Street / door no." value={data.street} onChange={set("street")} />
                    </Field>
                    <div className="grid-2">
                      <Field label="City">
                        <TextInput value={data.city} onChange={set("city")} />
                      </Field>
                      <Field label="District">
                        <TextInput value={data.district} onChange={set("district")} />
                      </Field>
                      <Field label="State">
                        <TextInput value={data.state} onChange={set("state")} />
                      </Field>
                      <Field label="Pincode">
                        <TextInput value={data.pincode} onChange={set("pincode")} />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="grid-2">
                      <Field label="Name of the college last attended">
                        <TextInput value={data.lastCollege} onChange={set("lastCollege")} />
                      </Field>
                      <Field label="Name of the university last studied">
                        <TextInput value={data.lastUniversity} onChange={set("lastUniversity")} />
                      </Field>
                    </div>

                    <div style={{ marginTop: 16, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="text-sm" style={{ fontWeight: 500 }}>Details of qualifications from graduate</span>
                      <button type="button" onClick={addQual} className="text-xs" style={{ color: "var(--oxblood)", background: "none", border: "none", cursor: "pointer" }}>
                        + add row
                      </button>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--parchment-line)", color: "#8A8375" }}>
                            <th style={{ textAlign: "left", padding: "6px 4px", fontWeight: 500 }}>Programme</th>
                            <th style={{ textAlign: "left", padding: "6px 4px", fontWeight: 500 }}>Subject</th>
                            <th style={{ textAlign: "left", padding: "6px 4px", fontWeight: 500 }}>University</th>
                            <th style={{ textAlign: "left", padding: "6px 4px", fontWeight: 500 }}>Reg no.</th>
                            <th style={{ textAlign: "left", padding: "6px 4px", fontWeight: 500 }}>Year</th>
                            <th style={{ textAlign: "left", padding: "6px 4px", fontWeight: 500 }}>Class</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {quals.map((row) => (
                            <tr key={row.id} style={{ borderBottom: "1px solid var(--parchment-line)" }}>
                              <td style={{ padding: "6px 4px", minWidth: 100 }}>
                                <select
                                  value={row.programme}
                                  onChange={(e) => updateQual(row.id, "programme", e.target.value)}
                                  className="field-underline"
                                >
                                  <option value="">select</option>
                                  {PROGRAMMES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={{ padding: "6px 4px" }}>
                                <TextInput value={row.subject} onChange={(e) => updateQual(row.id, "subject", e.target.value)} />
                              </td>
                              <td style={{ padding: "6px 4px" }}>
                                <TextInput value={row.university} onChange={(e) => updateQual(row.id, "university", e.target.value)} />
                              </td>
                              <td style={{ padding: "6px 4px" }}>
                                <TextInput value={row.regNo} onChange={(e) => updateQual(row.id, "regNo", e.target.value)} />
                              </td>
                              <td style={{ padding: "6px 4px", width: 80 }}>
                                <TextInput value={row.year} onChange={(e) => updateQual(row.id, "year", e.target.value)} />
                              </td>
                              <td style={{ padding: "6px 4px", width: 80 }}>
                                <TextInput value={row.cls} onChange={(e) => updateQual(row.id, "cls", e.target.value)} />
                              </td>
                              <td style={{ padding: "6px 4px" }}>
                                <button type="button" onClick={() => removeQual(row.id)} className="text-xs" style={{ color: "var(--rust)", background: "none", border: "none", cursor: "pointer" }}>
                                  remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink)", marginBottom: 16 }}>
                        <input type="checkbox" checked={data.working} onChange={set("working")} />
                        Currently working
                      </label>
                      {data.working && (
                        <Field label="Name of the college / institution currently working at">
                          <TextInput value={data.institutionName} onChange={set("institutionName")} />
                        </Field>
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <Field label="Guide (supervisor)" hint="Selected from approved guide list — populated by admin">
                      <TextInput placeholder="Search guide by name / department" value={data.guide} onChange={set("guide")} />
                    </Field>
                    <Field label="Co-guide" hint="Optional">
                      <TextInput placeholder="Search co-guide by name / department" value={data.coGuide} onChange={set("coGuide")} />
                    </Field>
                    <div style={{ fontSize: 12.5, color: "#8A8375", marginTop: 8 }}>
                      Guide consent status: <span style={{ color: "var(--brass)" }}>pending</span> — the guide verifies and signs your application at the review stage.
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div
                      style={{
                        border: "1px solid var(--parchment-line)",
                        padding: "16px 18px",
                        fontSize: 13.5,
                        lineHeight: 1.7,
                        color: "var(--ink)",
                        marginBottom: 16,
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                      }}
                    >
                      I declare that all the particulars furnished above are correct and I submit that I will abide by the rules and regulations of the college.
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginBottom: 4 }}>
                      <input type="checkbox" checked={data.declarationAccepted} onChange={set("declarationAccepted")} />
                      I accept the declaration above
                    </label>
                    {errors.declarationAccepted && (
                      <div style={{ color: "var(--rust)", fontSize: 12, marginBottom: 16 }}>{errors.declarationAccepted}</div>
                    )}
                    <div style={{ marginTop: 24 }}>
                      <SignaturePad label="Scholar's signature" value={signature} onChange={setSignature} />
                      {errors.signature && (
                        <div style={{ color: "var(--rust)", fontSize: 12, marginTop: 8 }}>{errors.signature}</div>
                      )}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--oxblood-deep)", marginBottom: 14, fontWeight: "bold" }}>
                      Review before submitting
                    </div>
                    {[
                      ["Subject", data.subject],
                      ["Name", data.fullName],
                      ["Sex", data.gender],
                      ["Date of birth", data.dob],
                      ["Religion", data.religion],
                      ["Community", data.community],
                      ["Email", data.email],
                      ["Mobile", data.mobile1],
                      ["Address", [data.street, data.city, data.district, data.state, data.pincode].filter(Boolean).join(", ")],
                      ["Last college", data.lastCollege],
                      ["Last university", data.lastUniversity],
                      ["Qualifications", `${quals.filter((q) => q.programme).length} row(s) entered`],
                      ["Guide", data.guide || "not selected"],
                      ["Co-guide", data.coGuide || "—"],
                      ["Signature", signature ? "captured" : "missing"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--parchment-line)", fontSize: 13.5 }}>
                        <span style={{ color: "#8A8375" }}>{k}</span>
                        <span style={{ color: "var(--ink)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v || "—"}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 18, fontSize: 12.5, color: "var(--sage)" }}>
                      Once submitted, an admin will review your application and assign a guide.
                    </div>
                  </div>
                )}

                {/* Nav */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--parchment-line)" }}>
                  <button type="button" className="btn-ghost" onClick={goBack} disabled={step === 0} style={step === 0 ? { opacity: 0.4, cursor: "default" } : {}}>
                    Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button type="button" className="btn-primary" onClick={goNext}>
                      Continue
                    </button>
                  ) : (
                    <button type="button" className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit application"}
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

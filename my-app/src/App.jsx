import React, { useState } from "react";
import chiefGuest from "./assets/chiefGuest.jpeg";

/* ============================================================
   HackZen'26 — Hackathon Landing Page (React version)
   ------------------------------------------------------------
   WHAT CHANGED IN THIS PASS
   - College name, HOD names, and staff coordinator details filled in.
   - "Chapter 0X" labels removed from every section.
   - Palette switched to: white bg / deep purple primary (#6D28D9) /
     light purple secondary (#8B5CF6) / gold (#F59E0B) used ONLY for
     the "'26" mark, buttons, and small accents.
   - "by team ZenXora" made larger + bolder in the footer.
   - "Register Your Team" now opens a real in-page registration
     form instead of an anchor link. The form:
       * collects Team Name, Leader (name/email/phone), and 4
         more members (name/email/phone each) = 5 total members
       * has a PPT upload field
       * every field is mandatory — Submit stays disabled until
         all fields are valid
       * on submit, it appends the entry to localStorage and
         downloads an up-to-date CSV ("hackzen26_registrations.csv")
         that opens directly in Excel/Google Sheets. This keeps a
         running spreadsheet of every registration without needing
         a backend. If you later add a server, swap
         `saveRegistration()` for a fetch() to your API / Google
         Apps Script webhook and keep everything else as-is.
       * PPT files are matched by filename in the sheet — actual
         binary upload needs a backend/storage bucket (e.g. Google
         Drive API, S3) since a CSV can't hold a file. Point form
         is left ready for that swap (see `handleFileChange`).
   ============================================================ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

.hz26{
  --bg:#FFFFFF;
  --panel:#FAF7FF;
  --panel-2:#F2EBFC;
  --line:#E4D9F7;
  --text:#1F1730;
  --muted:#726A87;
  --violet:#6D28D9;       /* primary */
  --violet-deep:#5B21B6;  /* primary, hover/deep */
  --violet-light:#8B5CF6; /* secondary */
  --gold:#F59E0B;         /* highlight only: '26 mark, buttons, small accents */
  --gold-deep:#B7740A;
  background:var(--bg);
  color:var(--text);
  font-family:'Inter', sans-serif;
  line-height:1.5;
  overflow-x:hidden;
  position:relative;
}
.hz26 *{box-sizing:border-box;}
.hz26::before{
  content:"";
  position:fixed; inset:0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size:56px 56px;
  opacity:0.5;
  pointer-events:none;
  z-index:0;
}
.hz26 .wrap{max-width:1080px; margin:0 auto; padding:0 24px; position:relative; z-index:1;}
.hz26 h1,.hz26 h2,.hz26 h3{font-family:'Space Grotesk', sans-serif;}
.hz26 .mono{font-family:'JetBrains Mono', monospace;}

/* NAV */
.hz26 nav{
  position:sticky; top:0; z-index:50;
  background:rgba(255,255,255,0.85);
  backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.hz26 nav .wrap{display:flex; align-items:center; justify-content:space-between; padding:16px 24px;}
.hz26 .brand{font-family:'Space Grotesk'; font-weight:700; font-size:19px; letter-spacing:0.3px; cursor:pointer;}
.hz26 .brand span{color:var(--gold);}
.hz26 nav a.reg-mini, .hz26 nav button.reg-mini{
  font-family:'JetBrains Mono'; font-size:12px; color:#FFFFFF;
  background:linear-gradient(100deg, var(--violet), var(--violet-deep)); padding:9px 16px; border-radius:4px;
  text-decoration:none; font-weight:600; letter-spacing:0.3px;
  border:none; cursor:pointer;
  transition:transform 0.15s ease;
}
.hz26 nav a.reg-mini:hover, .hz26 nav button.reg-mini:hover{transform:translateY(-1px);}

/* CHIEF GUEST SPOTLIGHT (front and center, first section) */
.hz26 .guest-spotlight{padding:56px 0 40px; border-top:none;}
.hz26 .spotlight-card{
  background:linear-gradient(135deg, var(--panel), var(--panel-2));
  border:1px solid var(--line); border-radius:12px; padding:36px;
  display:flex; gap:28px; align-items:center; flex-wrap:wrap;
  box-shadow:0 4px 24px rgba(109,40,217,0.08);
}
.hz26 .spotlight-photo{
  width:120px; height:120px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg, var(--violet), var(--violet-light));
  display:flex; align-items:center; justify-content:center;
  font-family:'Space Grotesk'; font-weight:700; font-size:34px; color:#FFFFFF;
  border:3px solid #FFFFFF;
  box-shadow:0 4px 18px rgba(109,40,217,0.25);
  overflow:hidden;
}
.hz26 .spotlight-name{font-size:clamp(24px,3vw,30px); font-weight:700;}
.hz26 .spotlight-desig{color:var(--violet-deep); font-family:'JetBrains Mono'; font-size:14px; margin-top:6px;}

/* HERO */
.hz26 header.hero{padding:64px 0 80px; position:relative;}
.hz26 .eyebrow{
  font-family:'JetBrains Mono'; font-size:13px; color:var(--violet);
  letter-spacing:2px; text-transform:uppercase; margin-bottom:18px;
  display:flex; align-items:center; gap:10px;
}
.hz26 .eyebrow::before{content:"●"; color:var(--gold); font-size:10px;}
.hz26 .hero h1{
  font-size:clamp(48px, 9vw, 96px);
  font-weight:700; line-height:0.98; letter-spacing:-2px;
  margin-bottom:20px;
  color:var(--text);
}
.hz26 .hero h1 .gold26{color:var(--gold);}
.hz26 .hero .tagline{
  font-size:clamp(18px, 2.4vw, 24px);
  font-weight:700; color:var(--text);
  max-width:640px; margin:8px 0 34px;
  border-left:3px solid var(--gold);
  padding-left:16px;
}
.hz26 .hero .org-line{color:var(--muted); font-size:15px; margin-bottom:36px;}
.hz26 .hero .org-line strong{color:var(--text); font-weight:600;}
.hz26 .cta-row{display:flex; gap:16px; flex-wrap:wrap; align-items:center;}
.hz26 .btn-primary{
  font-family:'Space Grotesk'; font-weight:600; font-size:16px;
  background:linear-gradient(100deg, var(--gold), var(--gold-deep)); color:#241B00; border:none;
  padding:16px 34px; border-radius:5px; cursor:pointer;
  text-decoration:none; display:inline-block;
  transition:transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow:0 0 0 rgba(245,158,11,0);
}
.hz26 .btn-primary:hover{transform:translateY(-2px); box-shadow:0 8px 24px rgba(245,158,11,0.35);}
.hz26 .btn-primary:disabled{opacity:0.45; cursor:not-allowed; transform:none; box-shadow:none;}
.hz26 .btn-sub{font-family:'JetBrains Mono'; font-size:13px; color:var(--muted);}

.hz26 section{padding:72px 0; border-top:1px solid var(--line);}
.hz26 .section-title{font-size:clamp(28px,4vw,38px); font-weight:700; margin-bottom:36px; letter-spacing:-0.5px;color: #2e4f91;}

/* ORGANIZERS */
.hz26 .split{display:grid; grid-template-columns:1fr 1fr; gap:28px;}
@media(max-width:760px){.hz26 .split{grid-template-columns:1fr;}}
.hz26 .card{
  background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:28px;
  box-shadow:0 2px 14px rgba(109,40,217,0.05);
}
.hz26 .hod-list{list-style:none; margin-top:16px;}
.hz26 .hod-list li{
  display:flex; justify-content:space-between; padding:12px 0; border-top:1px dashed var(--line);
  font-size:15px;
}
.hz26 .hod-list li:first-child{border-top:none;}
.hz26 .hod-list .role{color:var(--muted); font-family:'JetBrains Mono'; font-size:12px;}

/* THEMES */
.hz26 .theme-grid{display:grid; grid-template-columns:repeat(3, 1fr); gap:20px;}
@media(max-width:760px){.hz26 .theme-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:520px){.hz26 .theme-grid{grid-template-columns:1fr;}}
.hz26 .theme-card{
  background:var(--panel); border:1px solid var(--line); border-radius:8px;
  padding:24px; transition:border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.hz26 .theme-card:hover{border-color:var(--violet); transform:translateY(-3px); box-shadow:0 8px 20px rgba(109,40,217,0.12);}
.hz26 .theme-id{font-family:'JetBrains Mono'; color:var(--violet-deep); font-size:12px; margin-bottom:12px;}
.hz26 .theme-card h3{font-size:17px; font-weight:600; margin-bottom:8px;}
.hz26 .theme-card p{color:var(--muted); font-size:13.5px;}

/* RULES */
.hz26 .rules-list{list-style:none;}
.hz26 .rules-list li{
  display:flex; gap:16px; padding:16px 0; border-top:1px solid var(--line); font-size:15px;
}
.hz26 .rules-list li:first-child{border-top:none;}
.hz26 .rules-list .num{
  font-family:'JetBrains Mono'; color:var(--violet); font-size:13px; flex-shrink:0; padding-top:2px;
}
.hz26 .rules-list strong{color:var(--text);}

/* FLOW - terminal log signature element */
.hz26 .log-window{
  background:var(--panel); border:1px solid var(--line); border-radius:10px; overflow:hidden;
  box-shadow:0 2px 14px rgba(109,40,217,0.05);
}
.hz26 .log-bar{
  display:flex; gap:7px; padding:12px 16px; border-bottom:1px solid var(--line); background:var(--panel-2);
  align-items:center;
}
.hz26 .log-bar span{width:11px; height:11px; border-radius:50%; background:var(--line);}
.hz26 .log-bar span:nth-child(1){background:#E05D5D;}
.hz26 .log-bar span:nth-child(2){background:var(--gold);}
.hz26 .log-bar span:nth-child(3){background:#4CAF7D;}
.hz26 .log-title{margin-left:8px; color:var(--muted); font-size:12px;}
.hz26 .log-body{padding:8px 0;}
.hz26 .log-line{
  display:grid; grid-template-columns:130px 1fr; gap:18px;
  padding:18px 24px; border-top:1px dashed var(--line); align-items:baseline;
}
.hz26 .log-line:first-child{border-top:none;}
.hz26 .log-time{font-family:'JetBrains Mono'; font-size:12px; color:var(--violet);}
.hz26 .log-step h3{font-size:16px; font-weight:600; margin-bottom:5px;}
.hz26 .log-step p{color:var(--muted); font-size:14px;}
.hz26 .log-step .tag{
  display:inline-block; font-family:'JetBrains Mono'; font-size:11px; color:var(--gold-deep);
  border:1px solid var(--gold); border-radius:20px; padding:2px 10px; margin-bottom:8px;
}

/* COORDINATORS */
.hz26 .coord-grid{display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:16px;}
@media(max-width:760px){.hz26 .coord-grid{grid-template-columns:1fr;}}
.hz26 .coord-card{background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:22px;}
.hz26 .coord-card .group-label{
  font-family:'JetBrains Mono'; font-size:11px; color:var(--muted); letter-spacing:1.5px;
  text-transform:uppercase; margin-bottom:14px;
}
.hz26 .person{padding:12px 0; border-top:1px solid var(--line);}
.hz26 .person:first-child{border-top:none;}
.hz26 .person .pname{font-weight:600; font-size:15px;}
.hz26 .person .pmeta{color:var(--muted); font-size:12.5px; margin-top:2px;}
.hz26 .person .pcontact{font-family:'JetBrains Mono'; font-size:12.5px; color:var(--violet); margin-top:5px;}

.hz26 footer{padding:48px 0; text-align:center; border-top:1px solid var(--line);}
.hz26 footer .signature{
  font-family:'Space Grotesk'; font-weight:800; font-size:22px; letter-spacing:0.5px;
}
.hz26 footer .signature span{color:var(--violet-deep); font-weight:800;}
.hz26 footer .fine{color:var(--muted); font-size:12px; margin-top:10px; font-family:'JetBrains Mono';}

/* ===== REGISTRATION PAGE ===== */
.hz26 .reg-page{padding:56px 0 80px;}
.hz26 .reg-back{
  font-family:'JetBrains Mono'; font-size:13px; color:var(--violet-deep);
  background:none; border:none; cursor:pointer; padding:0; margin-bottom:22px;
  display:inline-flex; align-items:center; gap:6px;
}
.hz26 .reg-back:hover{text-decoration:underline;}
.hz26 .reg-title{font-size:clamp(28px,4vw,40px); font-weight:700; margin-bottom:8px;color: #2e4f91;}
.hz26 .reg-sub{color:var(--muted); font-size:14.5px; margin-bottom:32px;}
.hz26 .reg-form{background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:32px;}
.hz26 .field-group{margin-bottom:28px;}
.hz26 .field-group:last-child{margin-bottom:0;}
.hz26 .field-group h3{
  font-family:'JetBrains Mono'; font-size:13px; color:var(--violet);
  text-transform:uppercase; letter-spacing:1px; margin-bottom:14px;
  padding-bottom:10px; border-bottom:1px dashed var(--line);
}
.hz26 .field-row{display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px;}
@media(max-width:700px){.hz26 .field-row{grid-template-columns:1fr;}}
.hz26 .field-row.single{grid-template-columns:1fr;}
.hz26 label{display:block; font-size:12.5px; color:var(--muted); margin-bottom:6px; font-family:'JetBrains Mono';}
.hz26 input[type="text"], .hz26 input[type="email"], .hz26 input[type="tel"]{
  width:100%; padding:11px 12px; border:1px solid var(--line); border-radius:5px;
  font-family:'Inter'; font-size:14px; color:var(--text); background:#FFFFFF;
  transition:border-color 0.15s ease;
}
.hz26 input:focus{outline:none; border-color:var(--violet-light);}
.hz26 input.invalid{border-color:#E05D5D;}
.hz26 .file-drop{
  border:1.5px dashed var(--line); border-radius:6px; padding:18px; text-align:center;
  background:#FFFFFF; cursor:pointer;
}
.hz26 .file-drop:hover{border-color:var(--violet-light);}
.hz26 .file-drop input{display:none;}
.hz26 .file-drop .fname{font-family:'JetBrains Mono'; font-size:13px; color:var(--violet-deep); margin-top:6px;}
.hz26 .reg-footer{display:flex; align-items:center; gap:16px; margin-top:30px; flex-wrap:wrap;}
.hz26 .reg-note{font-family:'JetBrains Mono'; font-size:12px; color:var(--muted);}
.hz26 .reg-success{
  background:var(--panel-2); border:1px solid var(--violet-light); border-radius:8px;
  padding:22px; font-size:14.5px; margin-bottom:24px;
}
.hz26 .reg-success strong{color:var(--violet-deep);}
`;

const themes = [
  { id: "TRACK 01", title: "Healthcare AI", desc: "Smart diagnostics, patient monitoring, and predictive care solutions." },
  { id: "TRACK 02", title: "FinTech & Data", desc: "Fraud detection, financial analytics, and inclusive banking tools." },
  { id: "TRACK 03", title: "Smart Agriculture", desc: "IoT + AI for crop monitoring, yield prediction, and farm automation." },
  { id: "TRACK 04", title: "Sustainable Cities", desc: "Traffic, waste, and energy optimisation using data-driven systems." },
  { id: "TRACK 05", title: "EdTech Innovation", desc: "Personalised learning, skill assessment, and accessibility tools." },
  { id: "TRACK 06", title: "Cybersecurity & IoT", desc: "Threat detection, secure devices, and privacy-first architectures." },
];

const rules = [
  <>Each team must consist of exactly <strong>5 members</strong>.</>,
  <>Every team must include <strong>at least one boy and one girl</strong> — mandatory.</>,
  <>Idea submissions must be original and built by the team from scratch.</>,
  <>Products must be developed <strong>independently by the team</strong> — no outsourced builds.</>,
  <>Only teams shortlisted in the online evaluation round proceed to the final round.</>,
  <>Decisions made by the judging panel and coordinators are final.</>,
];

const flow = [
  { time: "STEP 01", tag: "registration open", title: "Team Registration", detail: <>Register your 5-member team using the link above. Registrations close on <strong>29 July 2026</strong>.</> },
  { time: "by 29 JUL", tag: "idea submission", title: "Submit Your Idea", detail: "Think through your idea and submit it as a drive link, posted in the WhatsApp group, before 29 July." },
  { time: "STEP 02", tag: "shortlisting", title: "Online Evaluation", detail: <>Ideas are reviewed online and the <strong>top 35 teams</strong> with the best ideas are shortlisted.</> },
  { time: "build phase", tag: "build your product", title: "Build It Yourself", detail: "Shortlisted teams build their own working product ahead of the final round." },
  { time: "13 AUG", tag: "grand finale", title: "Final Round", detail: <>Shortlisted teams present and demo their products on <strong>13 August 2026</strong>.</> },
];

const EMPTY_MEMBER = { name: "", email: "", phone: "" };
const EMPTY_FORM = {
  teamName: "",
  leader: { ...EMPTY_MEMBER },
  members: [{ ...EMPTY_MEMBER }, { ...EMPTY_MEMBER }, { ...EMPTY_MEMBER }, { ...EMPTY_MEMBER }],
  pptFile: null,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;

function isMemberValid(m) {
  return m.name.trim().length > 1 && EMAIL_RE.test(m.email.trim()) && PHONE_RE.test(m.phone.trim());
}

function isFormValid(form) {
  return (
    form.teamName.trim().length > 1 &&
    isMemberValid(form.leader) &&
    form.members.every(isMemberValid) &&
    !!form.pptFile
  );
}

/* Appends this registration to a running CSV in localStorage and
   triggers a download of the full sheet so far. Swap this function
   out for a real API/Google Sheets webhook call when a backend exists. */
function saveRegistrationAndExport(form) {
  const header = [
    "Team Name",
    "Leader Name", "Leader Email", "Leader Phone",
    "Member 2 Name", "Member 2 Email", "Member 2 Phone",
    "Member 3 Name", "Member 3 Email", "Member 3 Phone",
    "Member 4 Name", "Member 4 Email", "Member 4 Phone",
    "Member 5 Name", "Member 5 Email", "Member 5 Phone",
    "PPT Filename", "Submitted At",
  ];

  const row = [
    form.teamName,
    form.leader.name, form.leader.email, form.leader.phone,
    ...form.members.flatMap((m) => [m.name, m.email, m.phone]),
    form.pptFile ? form.pptFile.name : "",
    new Date().toISOString(),
  ];

  const existingRaw = window.localStorage.getItem("hackzen26_registrations_v1");
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  const updated = [...existing, row];
  window.localStorage.setItem("hackzen26_registrations_v1", JSON.stringify(updated));

  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [header, ...updated].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hackzen26_registrations.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function MemberFields({ label, value, onChange, invalidCheck }) {
  const update = (field) => (e) => onChange({ ...value, [field]: e.target.value });
  return (
    <div className="field-row">
      <div>
        <label>{label} — Name *</label>
        <input
          type="text"
          value={value.name}
          onChange={update("name")}
          className={invalidCheck && value.name.trim().length <= 1 ? "invalid" : ""}
        />
      </div>
      <div>
        <label>{label} — Email *</label>
        <input
          type="email"
          value={value.email}
          onChange={update("email")}
          className={invalidCheck && !EMAIL_RE.test(value.email.trim()) ? "invalid" : ""}
        />
      </div>
      <div>
        <label>{label} — Phone *</label>
        <input
          type="tel"
          value={value.phone}
          onChange={update("phone")}
          placeholder="10-digit number"
          className={invalidCheck && !PHONE_RE.test(value.phone.trim()) ? "invalid" : ""}
        />
      </div>
    </div>
  );
}

function RegistrationPage({ onBack }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const valid = isFormValid(form);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isFormValid(form)) return;
    saveRegistrationAndExport(form);
    setSubmitted(true);
    setForm(EMPTY_FORM);
    setTouched(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    // NOTE: this only records the filename. To actually store the .ppt/.pptx
    // binary, upload `file` to a backend endpoint or storage bucket here
    // (e.g. Google Drive API, S3, Firebase Storage) and save the returned
    // URL instead of relying on the filename alone.
    setForm((f) => ({ ...f, pptFile: file || null }));
  };

  return (
    <div className="reg-page">
      <div className="wrap">
        <button className="reg-back" onClick={onBack}>← Back to HackZen'26</button>
        <h1 className="reg-title">Team Registration</h1>
        <p className="reg-sub">
          Fill in every field for all 5 team members and upload your idea PPT. Registrations close 29 July 2026.
        </p>

        {submitted && (
          <div className="reg-success">
            <strong>Registration recorded.</strong> Your team's details were added to the registrations
            sheet and a fresh copy just downloaded to your device. You can submit another team below if needed.
          </div>
        )}

        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <h3>Team</h3>
            <div className="field-row single">
              <div>
                <label>Team Name *</label>
                <input
                  type="text"
                  value={form.teamName}
                  onChange={(e) => setForm((f) => ({ ...f, teamName: e.target.value }))}
                  className={touched && form.teamName.trim().length <= 1 ? "invalid" : ""}
                />
              </div>
            </div>
          </div>

          <div className="field-group">
            <h3>Team Leader</h3>
            <MemberFields
              label="Leader"
              value={form.leader}
              onChange={(v) => setForm((f) => ({ ...f, leader: v }))}
              invalidCheck={touched}
            />
          </div>

          <div className="field-group">
            <h3>Remaining 4 Members</h3>
            {form.members.map((m, i) => (
              <MemberFields
                key={i}
                label={`Member ${i + 2}`}
                value={m}
                onChange={(v) =>
                  setForm((f) => {
                    const members = [...f.members];
                    members[i] = v;
                    return { ...f, members };
                  })
                }
                invalidCheck={touched}
              />
            ))}
          </div>

          <div className="field-group">
            <h3>Idea Deck</h3>
            <label htmlFor="ppt-upload" className="file-drop">
              <input id="ppt-upload" type="file" accept=".ppt,.pptx,.pdf" onChange={handleFileChange} />
              {form.pptFile ? (
                <>
                  <div>Selected file</div>
                  <div className="fname">{form.pptFile.name}</div>
                </>
              ) : (
                <div>Click to upload your PPT (.ppt / .pptx / .pdf) *</div>
              )}
            </label>
          </div>

          <div className="reg-footer">
            <button type="submit" className="btn-primary" disabled={!valid}>
              Submit Registration
            </button>
            <span className="reg-note">
              {valid ? "All fields look good." : "All fields are mandatory — submit unlocks once everything is filled correctly."}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HackZen26() {
  const [page, setPage] = useState("landing");

  const goRegister = () => {
    setPage("register");
    window.scrollTo(0, 0);
  };
  const goLanding = () => {
    setPage("landing");
    window.scrollTo(0, 0);
  };

  if (page === "register") {
    return (
      <div className="hz26">
        <style>{styles}</style>
        <nav>
          <div className="wrap">
            <div className="brand" onClick={goLanding}>HackZen<span>'26</span></div>
          </div>
        </nav>
        <RegistrationPage onBack={goLanding} />
      </div>
    );
  }

  return (
    <div className="hz26">
      <style>{styles}</style>

      <nav>
        <div className="wrap">
          <div className="brand">HackZen<span>'26</span></div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="hero">
        <div className="wrap">
          <h1>
            HackZen<span className="gold26">'26</span>
          </h1>
          <p className="tagline">We're glad to invite you all to participate!</p>
          <p className="org-line">
            Organised by the <strong>Department of Artificial Intelligence &amp; Data Science</strong> ·{" "}
            <strong>Sri Krishna College Of Engineering and Technology</strong>
          </p>
          <div className="cta-row">
            <button className="btn-primary" onClick={goRegister}>
              Register Your Team
            </button>
            <span className="btn-sub">registrations close · 29 July 2026</span>
          </div>
        </div>
      </header>

      {/* ===== CHIEF GUEST — first section, front and center ===== */}
      <section className="guest-spotlight" style={{ borderTop: "none" }}>
        <div className="wrap">
          <div className="spotlight-card">
            <div className="spotlight-photo">
              <img
                src={chiefGuest}
                alt="Chief Guest"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div className="spotlight-name">Rhishinathvarma Marimuthu</div>
              <div className="spotlight-desig">Lead and Technical CTO, Scyverge</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
                Guest of Honour, HackZen'26
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ORGANIZERS (HODs) ===== */}
      <section id="organizers">
        <div className="wrap">
          <h2 className="section-title">Organised By</h2>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Department of AI &amp; Data Science</h3>
            <p style={{ color: "var(--muted)", fontSize: 13.5 }}>Heads of Department</p>
            <ul className="hod-list">
              <li>
                <span>S Venkatalakshmi</span>
                <span className="role">HOD, AI &amp; DS</span>
              </li>
              <li>
                <span>A Sujatha</span>
                <span className="role">Associate HOD, AI &amp; DS</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== THEMES ===== */}
      <section id="themes">
        <div className="wrap">
          <h2 className="section-title">Hackathon Themes</h2>
          <div className="theme-grid">
            {themes.map((t) => (
              <div className="theme-card" key={t.id}>
                <div className="theme-id">{t.id}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RULES ===== */}
      <section id="rules">
        <div className="wrap">
          <h2 className="section-title">Rules</h2>
          <div className="card">
            <ul className="rules-list">
              {rules.map((r, i) => (
                <li key={i}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== FLOW ===== */}
      <section id="flow">
        <div className="wrap">
          <h2 className="section-title">Event Flow</h2>
          <div className="log-window">
            <div className="log-bar">
              <span></span>
              <span></span>
              <span></span>
              <span className="mono log-title">hackzen26 — event.log</span>
            </div>
            <div className="log-body">
              {flow.map((f, i) => (
                <div className="log-line" key={i}>
                  <div className="log-time">{f.time}</div>
                  <div className="log-step">
                    <div className="tag">{f.tag}</div>
                    <h3>{f.title}</h3>
                    <p>{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== COORDINATORS ===== */}
      <section id="coordinators">
        <div className="wrap">
          <h2 className="section-title">Coordinators</h2>
          <div className="coord-grid">
            <div className="coord-card">
              <div className="group-label">Staff Coordinators</div>
              <div className="person">
                <div className="pname">Senthil Kumar S</div>
                <div className="pmeta">Staff Coordinator, AI &amp; DS</div>
                <div className="pcontact">senthilkumars@skcet.ac.in · +91 96882 13669</div>
              </div>
              <div className="person">
                <div className="pname">Ramprakash</div>
                <div className="pmeta">Staff Coordinator, AI &amp; DS</div>
                <div className="pcontact">ramprakash@skcet.ac.in</div>
              </div>
            </div>
            <div className="coord-card">
              <div className="group-label">Student Coordinators</div>
              <div className="person">
                <div className="pname">Harish H</div>
                <div className="pmeta">3rd Year, AIDS - A</div>
                <div className="pcontact">harish.h@[college].edu · +91 [Your Number]</div>
              </div>
              <div className="person">
                <div className="pname">Gokul G</div>
                <div className="pmeta">3rd Year, AIDS - A</div>
                <div className="pcontact">gokul.g@[college].edu · +91 90000 00004</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="signature">
            by team <span>ZenXora</span>
          </div>
          <div className="fine">HackZen'26 · Dept. of AI &amp; Data Science</div>
        </div>
      </footer>
    </div>
  );
}

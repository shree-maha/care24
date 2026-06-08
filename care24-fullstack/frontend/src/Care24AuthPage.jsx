import { useState, useEffect, useRef } from "react";

/* ── Design tokens ── */
const C = {
  navy:      "#0F1F3D",
  navyLight: "#1A3260",
  gold:      "#D4A853",
  goldLight: "#F0C97A",
  cream:     "#FAF7F2",
  white:     "#FFFFFF",
  text:      "#1A1A2E",
  muted:     "#6B7280",
  softBg:    "#F4EFE8",
  border:    "#E8E0D5",
  error:     "#DC2626",
  success:   "#059669",
};

/* ── Tiny helpers ── */
const Input = ({ label, type = "text", placeholder, value, onChange, error, icon, right }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow]       = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>{icon}</span>}
        <input
          type={isPass && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: `12px ${isPass ? 44 : 14}px 12px ${icon ? 42 : 14}px`,
            border: `1.5px solid ${error ? C.error : focused ? C.gold : C.border}`,
            borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14,
            color: C.text, background: C.white, outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 3px rgba(212,168,83,0.15)` : "none",
            boxSizing: "border-box",
          }}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.muted, padding: 4 }}>
            {show ? "🙈" : "👁"}
          </button>
        )}
        {right && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>{right}</span>}
      </div>
      {error && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.error, marginTop: 5 }}>⚠ {error}</p>}
    </div>
  );
};

const Btn = ({ children, onClick, variant = "primary", disabled, loading, style: sx }) => {
  const base = {
    width: "100%", padding: "13px 20px", borderRadius: 10, fontFamily: "'DM Sans',sans-serif",
    fontSize: 15, fontWeight: 600, cursor: disabled || loading ? "not-allowed" : "pointer",
    border: "none", transition: "all 0.2s", opacity: disabled ? 0.6 : 1, ...sx,
  };
  const styles = {
    primary: { background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.navy },
    secondary: { background: C.navy, color: C.white },
    ghost: { background: "transparent", border: `1.5px solid ${C.border}`, color: C.navy },
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{ ...base, ...styles[variant] }}>
      {loading ? "⏳ Please wait…" : children}
    </button>
  );
};

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

const SocialBtn = ({ icon, label, onClick }) => (
  <button onClick={onClick} style={{
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "11px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10,
    background: C.white, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
    fontSize: 13, fontWeight: 500, color: C.text, transition: "border-color 0.2s, box-shadow 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(212,168,83,0.1)`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
  >
    <span style={{ fontSize: 18 }}>{icon}</span> {label}
  </button>
);

/* ── OTP input ── */
const OtpInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = (value + "      ").slice(0, 6).split("");
  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next);
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      const next = value.slice(0, i) + e.key + value.slice(i + 1);
      onChange(next.slice(0, 6));
      if (i < 5) inputs.current[i + 1]?.focus();
    }
  };
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0" }}>
      {digits.map((d, i) => (
        <input key={i} ref={el => inputs.current[i] = el}
          value={d.trim()} readOnly
          onKeyDown={e => handleKey(i, e)}
          onFocus={() => inputs.current[i]?.select()}
          style={{
            width: 46, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700,
            border: `2px solid ${d.trim() ? C.gold : C.border}`, borderRadius: 10,
            fontFamily: "'DM Sans',sans-serif", color: C.navy, outline: "none",
            background: d.trim() ? "rgba(212,168,83,0.08)" : C.white,
            transition: "border-color 0.2s",
          }}
        />
      ))}
    </div>
  );
};

/* ── Password strength ── */
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["#E5E7EB", C.error, "#F59E0B", C.gold, C.success];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: -10, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= score ? colors[score] : "#E5E7EB", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: c.pass ? C.success : C.muted }}>
              {c.pass ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: colors[score] }}>{labels[score]}</span>
      </div>
    </div>
  );
};

/* ── Step indicator ── */
const Steps = ({ current, steps }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
    {steps.map((s, i) => (
      <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: i < current ? C.success : i === current ? C.gold : C.border,
            color: i < current ? C.white : i === current ? C.navy : C.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: i < current ? 14 : 13, fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif", transition: "all 0.3s",
          }}>
            {i < current ? "✓" : i + 1}
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: i === current ? C.navy : C.muted, fontWeight: i === current ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
        </div>
        {i < steps.length - 1 && (
          <div style={{ flex: 1, height: 2, background: i < current ? C.success : C.border, margin: "0 8px", marginBottom: 20, transition: "background 0.3s" }} />
        )}
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════
   PANELS
══════════════════════════════════════════ */

/* LOGIN */
function LoginPanel({ onSwitch, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("password"); // password | otp

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Enter a valid email address";
    if (mode === "password" && form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess("user"); }, 1500);
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: C.navy, marginBottom: 6 }}>Welcome back</h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 28 }}>Sign in to manage care for your loved ones</p>

      {/* Role toggle */}
      <RoleToggle />

      {/* Login mode toggle */}
      <div style={{ display: "flex", background: C.softBg, borderRadius: 10, padding: 4, marginBottom: 24 }}>
        {["password","otp"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
            background: mode === m ? C.white : "transparent",
            boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: mode === m ? 600 : 400,
            color: mode === m ? C.navy : C.muted, cursor: "pointer", transition: "all 0.2s",
          }}>
            {m === "password" ? "🔒 Password" : "📱 OTP Login"}
          </button>
        ))}
      </div>

      <Input label="Email address" type="email" placeholder="you@example.com" icon="✉" value={form.email} onChange={set("email")} error={errors.email} />
      {mode === "password" ? (
        <>
          <Input label="Password" type="password" placeholder="Enter your password" value={form.password} onChange={set("password")} error={errors.password} />
          <div style={{ textAlign: "right", marginTop: -10, marginBottom: 20 }}>
            <button style={{ background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.gold, cursor: "pointer", fontWeight: 500 }}>Forgot password?</button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginBottom: 4 }}>We'll send a 6-digit code to your email</p>
          <button style={{ background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.gold, cursor: "pointer", fontWeight: 600 }}>Send OTP →</button>
        </div>
      )}

      <Btn onClick={submit} loading={loading}>Sign In</Btn>

      <Divider label="or continue with" />
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <SocialBtn icon="🔵" label="Google" />
        <SocialBtn icon="📘" label="Facebook" />
      </div>

      <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted }}>
        Don't have an account?{" "}
        <button onClick={onSwitch} style={{ background: "none", border: "none", color: C.gold, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Create one →</button>
      </p>
    </div>
  );
}

/* ROLE TOGGLE */
function RoleToggle() {
  const [role, setRole] = useState("family");
  const roles = [{ id: "family", icon: "👨‍👩‍👧", label: "Family / Patient" }, { id: "caregiver", icon: "👩‍⚕️", label: "Caregiver" }, { id: "admin", icon: "🛡", label: "Admin" }];
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Sign in as</p>
      <div style={{ display: "flex", gap: 8 }}>
        {roles.map(r => (
          <button key={r.id} onClick={() => setRole(r.id)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10,
            border: `1.5px solid ${role === r.id ? C.gold : C.border}`,
            background: role === r.id ? "rgba(212,168,83,0.08)" : C.white,
            fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: role === r.id ? 600 : 400,
            color: role === r.id ? C.navy : C.muted, cursor: "pointer", transition: "all 0.2s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 20 }}>{r.icon}</span>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* REGISTER — multi-step */
function RegisterPanel({ onSwitch, onSuccess }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("family");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirm: "",
    // patient profile
    patientName: "", patientAge: "", relation: "", conditions: "",
    // caregiver
    qualification: "", experience: "", services: [],
  });

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: "" })); };

  const STEPS_FAMILY    = ["Account", "Verify", "Patient", "Done"];
  const STEPS_CAREGIVER = ["Account", "Verify", "Profile", "Done"];
  const steps = role === "caregiver" ? STEPS_CAREGIVER : STEPS_FAMILY;

  const validateStep0 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Enter a valid email";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "Enter a valid 10-digit number";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const next = () => {
    if (step === 0) {
      const e = validateStep0();
      if (Object.keys(e).length) { setErrors(e); return; }
      setLoading(true);
      setTimeout(() => { setLoading(false); setOtpSent(true); setStep(1); }, 1000);
    } else if (step === 1) {
      if (otp.length < 6) { setErrors({ otp: "Enter the 6-digit code" }); return; }
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep(2); }, 900);
    } else if (step === 2) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep(3); }, 1000);
    }
  };

  /* ── Step 0: Account details ── */
  const Step0 = () => (
    <>
      <div style={{ display: "flex", gap: 12 }}>
        <Input label="First name" placeholder="Rahul" value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
        <Input label="Last name" placeholder="Sharma" value={form.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>
      <Input label="Email address" type="email" icon="✉" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} />
      <Input label="Mobile number" type="tel" icon="📱" placeholder="98XXXXXXXX" value={form.phone} onChange={set("phone")} error={errors.phone} />
      <Input label="Password" type="password" placeholder="Create a password" value={form.password} onChange={set("password")} error={errors.password} />
      <PasswordStrength password={form.password} />
      <Input label="Confirm password" type="password" placeholder="Re-enter password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
    </>
  );

  /* ── Step 1: OTP verification ── */
  const Step1 = () => (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📩</div>
      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: C.navy, marginBottom: 8 }}>Check your inbox</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 4 }}>
        We sent a 6-digit code to
      </p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{form.email}</p>
      <OtpInput value={otp} onChange={setOtp} />
      {errors.otp && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.error }}>⚠ {errors.otp}</p>}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
        <button style={{ background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.gold, cursor: "pointer" }}>Resend code</button>
        <button style={{ background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, cursor: "pointer" }}>Change email</button>
      </div>
    </div>
  );

  /* ── Step 2: Profile details ── */
  const Step2Family = () => (
    <>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginBottom: 20 }}>Tell us about who needs care. You can update this later.</p>
      <Input label="Patient's full name" placeholder="e.g. Ramesh Sharma" value={form.patientName} onChange={set("patientName")} />
      <Input label="Patient's age" type="number" placeholder="e.g. 72" value={form.patientAge} onChange={set("patientAge")} />
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Your relation to patient</label>
        <select value={form.relation} onChange={set("relation")} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}>
          <option value="">Select relation</option>
          {["Son","Daughter","Spouse","Sibling","Parent","Other"].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Medical conditions (optional)</label>
        <textarea value={form.conditions} onChange={set("conditions")} placeholder="e.g. Diabetes, Hypertension, Post-knee replacement…" rows={3} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.text, background: C.white, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
      </div>
    </>
  );

  const CAREGIVER_SERVICES = ["Nursing Care", "Physiotherapy", "Elderly Attendant", "Post-Hospital Care", "Dementia Care", "Medication Support"];
  const Step2Caregiver = () => (
    <>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginBottom: 20 }}>Help us match you with the right care requests.</p>
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Highest qualification</label>
        <select value={form.qualification} onChange={set("qualification")} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}>
          <option value="">Select qualification</option>
          {["GNM – General Nursing & Midwifery","B.Sc Nursing","M.Sc Nursing","BPT – Physiotherapy","Diploma in Healthcare","Certified Home Health Aide"].map(q => <option key={q}>{q}</option>)}
        </select>
      </div>
      <Input label="Years of experience" type="number" placeholder="e.g. 5" value={form.experience} onChange={set("experience")} />
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Services you offer</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {CAREGIVER_SERVICES.map(s => {
            const on = form.services.includes(s);
            return (
              <button key={s} type="button"
                onClick={() => setForm(f => ({ ...f, services: on ? f.services.filter(x => x !== s) : [...f.services, s] }))}
                style={{ padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${on ? C.gold : C.border}`, background: on ? "rgba(212,168,83,0.1)" : C.white, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: on ? 600 : 400, color: on ? C.navy : C.muted, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                {on ? "✓ " : ""}{s}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  /* ── Step 3: Done ── */
  const Step3 = () => (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(5,150,105,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 20px" }}>✅</div>
      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, color: C.navy, marginBottom: 10 }}>You're all set!</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
        {role === "caregiver"
          ? "Your caregiver profile is under review. We'll notify you once verified — usually within 24 hours."
          : `Welcome to Care24, ${form.firstName}! Your account is ready. Let's find the perfect caregiver for ${form.patientName || "your loved one"}.`}
      </p>
      <Btn onClick={() => onSuccess(role)}>
        {role === "caregiver" ? "Go to Caregiver Dashboard →" : "Browse Caregivers →"}
      </Btn>
    </div>
  );

  const panels = [<Step0 />, <Step1 />, role === "caregiver" ? <Step2Caregiver /> : <Step2Family />, <Step3 />];

  return (
    <div>
      {step < 3 && (
        <>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, color: C.navy, marginBottom: 4 }}>Create your account</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 24 }}>Join thousands of families and caregivers on Care24</p>

          {/* Role selector — only on step 0 */}
          {step === 0 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {[{ id: "family", icon: "👨‍👩‍👧", label: "Family / Patient" }, { id: "caregiver", icon: "👩‍⚕️", label: "Caregiver" }].map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  flex: 1, padding: "12px 8px", borderRadius: 10,
                  border: `1.5px solid ${role === r.id ? C.gold : C.border}`,
                  background: role === r.id ? "rgba(212,168,83,0.08)" : C.white,
                  fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: role === r.id ? 700 : 400,
                  color: role === r.id ? C.navy : C.muted, cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 20 }}>{r.icon}</span> {r.label}
                </button>
              ))}
            </div>
          )}

          <Steps current={step} steps={steps} />
        </>
      )}

      {panels[step]}

      {step < 3 && step !== 3 && (
        <div style={{ marginTop: 20 }}>
          <Btn onClick={next} loading={loading}>
            {step === steps.length - 2 ? "Complete Registration" : "Continue →"}
          </Btn>
          {step > 0 && step < 3 && (
            <button onClick={() => setStep(s => s - 1)} style={{ width: "100%", marginTop: 10, background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, cursor: "pointer" }}>← Back</button>
          )}
        </div>
      )}

      {step === 0 && (
        <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginTop: 20 }}>
          Already have an account?{" "}
          <button onClick={onSwitch} style={{ background: "none", border: "none", color: C.gold, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Sign in →</button>
        </p>
      )}
    </div>
  );
}

/* ── Success screen ── */
function SuccessScreen({ role, onReset }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.navy, flexDirection: "column", gap: 20, padding: 32 }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 36, color: C.white, textAlign: "center" }}>Welcome to Care<span style={{ color: C.gold }}>24</span></h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 360 }}>
        {role === "caregiver" ? "Your application is being reviewed." : "Your account is ready. Let's get started."}
      </p>
      <button onClick={onReset} style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.navy, border: "none", padding: "13px 32px", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
        Back to Auth Demo
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function App() {
  const [view, setView]     = useState("login"); // login | register | success
  const [role, setRole]     = useState("user");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  if (view === "success") return <SuccessScreen role={role} onReset={() => setView("login")} />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.cream, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        input,select,textarea,button { font-family:'DM Sans',sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
      `}</style>

      {/* ── Left: branding panel ── */}
      <div style={{
        flex: "0 0 44%", background: `linear-gradient(160deg,${C.navy} 0%,${C.navyLight} 60%,#243B6E 100%)`,
        padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,168,83,0.14) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "-8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,168,83,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>❤</div>
          <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: C.white }}>Care<span style={{ color: C.gold }}>24</span></span>
        </div>

        {/* Centre content */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.goldLight, fontWeight: 500 }}>2,400+ verified caregivers</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,3.5vw,42px)", color: C.white, lineHeight: 1.2, marginBottom: 18 }}>
            Expert care,<br /><span style={{ color: C.gold, fontStyle: "italic" }}>trusted</span> by families
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.62)", lineHeight: 1.75, marginBottom: 40, maxWidth: 340 }}>
            Book verified nurses, physiotherapists and caregivers for personalised in-home elderly care.
          </p>

          {/* Feature list */}
          {["Background-verified caregivers","Real-time service tracking","Hourly, daily or long-term plans","24/7 family support"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(212,168,83,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: C.gold }}>✓</span>
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{f}</span>
            </div>
          ))}

          {/* Floating caregiver card */}
          <div style={{ marginTop: 36, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "16px 18px", animation: "float 4s ease-in-out infinite" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👩‍⚕️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: C.white }}>Neha Joshi, RN</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Nursing Care · 6 yrs exp.</div>
              </div>
              <div style={{ background: "rgba(5,150,105,0.2)", color: "#34D399", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Available</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: C.gold, fontSize: 13 }}>★</span>)}</div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>4.9 · 142 reviews</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", position: "relative" }}>© 2025 Care24 · Privacy Policy · Terms</p>
      </div>

      {/* ── Right: form panel ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 5vw", overflowY: "auto",
      }}>
        <div style={{
          width: "100%", maxWidth: 460,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease",
        }}>
          {view === "login"
            ? <LoginPanel onSwitch={() => setView("register")} onSuccess={r => { setRole(r); setView("success"); }} />
            : <RegisterPanel onSwitch={() => setView("login")} onSuccess={r => { setRole(r); setView("success"); }} />
          }
        </div>
      </div>
    </div>
  );
}

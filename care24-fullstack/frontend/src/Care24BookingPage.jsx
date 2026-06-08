import { useState } from "react";

const C = {
  navy:"#0F1F3D",navyLight:"#1A3260",gold:"#D4A853",goldLight:"#F0C97A",
  cream:"#FAF7F2",white:"#FFFFFF",text:"#1A1A2E",muted:"#6B7280",
  softBg:"#F4EFE8",border:"#E8E0D5",success:"#059669",error:"#DC2626",
};

const TIMES = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM"];
const DURATIONS = [{ label:"2 Hours", value:2, price:1 },{ label:"4 Hours", value:4, price:1.8 },{ label:"8 Hours (Full Day)", value:8, price:3.2 },{ label:"12 Hours (Night Shift)", value:12, price:4.5 },{ label:"24 Hours (Live-in)", value:24, price:7 }];
const SERVICES_LIST = ["Nursing Care","Physiotherapy","Elderly Attendant","Post-Hospital Care","Medication Support","Dementia Care"];

function getDays() {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function Steps({ current }) {
  const steps = ["Service","Schedule","Details","Confirm"];
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:36 }}>
      {steps.map((s,i) => (
        <div key={s} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : 0 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background: i < current ? C.success : i === current ? C.gold : C.border, color: i < current ? C.white : i === current ? C.navy : C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize: i < current ? 14 : 14, fontWeight:700, fontFamily:"'DM Sans',sans-serif", transition:"all 0.3s" }}>
              {i < current ? "✓" : i+1}
            </div>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color: i === current ? C.navy : C.muted, fontWeight: i === current ? 600 : 400, whiteSpace:"nowrap" }}>{s}</span>
          </div>
          {i < steps.length-1 && <div style={{ flex:1, height:2, background: i < current ? C.success : C.border, margin:"0 6px", marginBottom:20, transition:"background 0.3s" }} />}
        </div>
      ))}
    </div>
  );
}

export default function BookingPage({ onNavigate }) {
  const [step, setStep]           = useState(0);
  const [service, setService]     = useState("");
  const [careType, setCareType]   = useState("one-time");
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration]   = useState(null);
  const [notes, setNotes]         = useState("");
  const [address, setAddress]     = useState("");
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

  const days = getDays();
  const ratePerHour = 800;
  const totalCost = duration ? Math.round(ratePerHour * duration.price) : 0;

  const confirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1600);
  };

  if (done) return (
    <div style={{ minHeight:"100vh", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20, padding:32, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes pop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
      <div style={{ width:100, height:100, borderRadius:"50%", background:"rgba(5,150,105,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, animation:"pop 0.5s ease forwards" }}>✅</div>
      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:34, color:C.white, textAlign:"center" }}>Booking Confirmed!</h2>
      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"24px 32px", maxWidth:380, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>Booking Reference</div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.gold, marginBottom:16 }}>C24-{Math.floor(Math.random()*90000)+10000}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[["Service", service || "Nursing Care"],["Caregiver","Neha Joshi, RN"],["Date", `${DAY_NAMES[days[selectedDay].getDay()]}, ${days[selectedDay].getDate()} ${MONTH_NAMES[days[selectedDay].getMonth()]}`],["Time", selectedTime || "09:00 AM"],["Duration", duration?.label || "4 Hours"],["Total", `₹${totalCost || 1440}`]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(255,255,255,0.5)" }}>{k}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.white }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(255,255,255,0.5)", textAlign:"center", maxWidth:320 }}>Your caregiver will arrive on time. You'll receive SMS and email updates.</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        <button onClick={() => onNavigate && onNavigate("dashboard")} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, border:"none", padding:"12px 28px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>Go to Dashboard →</button>
        <button onClick={() => { setDone(false); setStep(0); }} style={{ background:"rgba(255,255,255,0.08)", color:C.white, border:"1px solid rgba(255,255,255,0.15)", padding:"12px 24px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, cursor:"pointer" }}>Book Another</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Topbar */}
      <div style={{ background:C.navy, padding:"16px 5vw", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => onNavigate && onNavigate("landing")}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>❤</div>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.white }}>Care<span style={{ color:C.gold }}>24</span></span>
        </div>
        <button onClick={() => onNavigate && onNavigate("services")} style={{ background:"rgba(255,255,255,0.08)", color:C.white, border:"1px solid rgba(255,255,255,0.15)", padding:"8px 16px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer" }}>← Back to Caregivers</button>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"48px 5vw" }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:C.navy, marginBottom:6 }}>Book a Caregiver</h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:36 }}>Complete the steps below to confirm your booking</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:32, alignItems:"start" }}>
          {/* Left: form */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:32 }}>
            <Steps current={step} />

            {/* Step 0: Service */}
            {step === 0 && (
              <div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.navy, marginBottom:6 }}>Select a Service</h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, marginBottom:24 }}>Choose the type of care your loved one needs</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
                  {SERVICES_LIST.map(s => (
                    <button key={s} onClick={() => setService(s)}
                      style={{ padding:"14px 12px", borderRadius:10, border:`1.5px solid ${service === s ? C.gold : C.border}`, background: service === s ? "rgba(212,168,83,0.1)" : C.white, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: service === s ? 600 : 400, color: service === s ? C.navy : C.muted, cursor:"pointer", transition:"all 0.2s", textAlign:"left" }}>
                      {service === s ? "✓ " : ""}{s}
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom:24 }}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy, marginBottom:10 }}>Care Type</p>
                  <div style={{ display:"flex", gap:10 }}>
                    {[{ id:"one-time", label:"One-time visit" },{ id:"recurring", label:"Recurring care" },{ id:"long-term", label:"Long-term (live-in)" }].map(t => (
                      <button key={t.id} onClick={() => setCareType(t.id)}
                        style={{ flex:1, padding:"10px 8px", borderRadius:10, border:`1.5px solid ${careType === t.id ? C.gold : C.border}`, background: careType === t.id ? "rgba(212,168,83,0.1)" : C.white, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight: careType === t.id ? 600 : 400, color: careType === t.id ? C.navy : C.muted, cursor:"pointer", transition:"all 0.2s" }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Schedule */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.navy, marginBottom:6 }}>Choose a Schedule</h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, marginBottom:24 }}>Select the date, time and duration</p>

                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy, marginBottom:12 }}>Date</p>
                <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:24 }}>
                  {days.map((d,i) => (
                    <button key={i} onClick={() => setSelectedDay(i)}
                      style={{ flexShrink:0, width:58, padding:"10px 0", borderRadius:10, border:`1.5px solid ${selectedDay === i ? C.gold : C.border}`, background: selectedDay === i ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : C.white, cursor:"pointer", transition:"all 0.2s" }}>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color: selectedDay === i ? C.navy : C.muted, marginBottom:4 }}>{DAY_NAMES[d.getDay()]}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, fontWeight:700, color: selectedDay === i ? C.navy : C.text }}>{d.getDate()}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color: selectedDay === i ? C.navy : C.muted }}>{MONTH_NAMES[d.getMonth()]}</div>
                    </button>
                  ))}
                </div>

                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy, marginBottom:12 }}>Time</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:24 }}>
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      style={{ padding:"9px 4px", borderRadius:8, border:`1.5px solid ${selectedTime === t ? C.gold : C.border}`, background: selectedTime === t ? "rgba(212,168,83,0.1)" : C.white, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight: selectedTime === t ? 600 : 400, color: selectedTime === t ? C.navy : C.muted, cursor:"pointer", transition:"all 0.2s" }}>
                      {t}
                    </button>
                  ))}
                </div>

                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy, marginBottom:12 }}>Duration</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {DURATIONS.map(d => (
                    <button key={d.value} onClick={() => setDuration(d)}
                      style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${duration?.value === d.value ? C.gold : C.border}`, background: duration?.value === d.value ? "rgba(212,168,83,0.1)" : C.white, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", transition:"all 0.2s" }}>
                      <span style={{ fontSize:14, fontWeight: duration?.value === d.value ? 600 : 400, color: duration?.value === d.value ? C.navy : C.text }}>{d.label}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:C.gold }}>₹{Math.round(ratePerHour * d.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.navy, marginBottom:6 }}>Care Details</h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, marginBottom:24 }}>Help the caregiver prepare for the visit</p>

                {[{ label:"Patient's Name", val:patientName, set:setPatientName, placeholder:"e.g. Ramesh Sharma" },{ label:"Home Address", val:address, set:setAddress, placeholder:"Full address with landmark" }].map(f => (
                  <div key={f.label} style={{ marginBottom:18 }}>
                    <label style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy, marginBottom:6 }}>{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                      style={{ width:"100%", padding:"12px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.text, outline:"none" }} />
                  </div>
                ))}
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:"block", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy, marginBottom:6 }}>Special Instructions (optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="e.g. Patient has knee surgery recovery needs. Requires gentle handling. Allergic to latex gloves."
                    style={{ width:"100%", padding:"12px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.text, outline:"none", resize:"vertical" }} />
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.navy, marginBottom:6 }}>Confirm Booking</h2>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, marginBottom:24 }}>Review your details before confirming</p>
                <div style={{ background:C.softBg, borderRadius:12, padding:20, marginBottom:24 }}>
                  {[["Service", service || "Nursing Care"],["Caregiver","Neha Joshi, RN"],["Date",`${DAY_NAMES[days[selectedDay].getDay()]}, ${days[selectedDay].getDate()} ${MONTH_NAMES[days[selectedDay].getMonth()]}`],["Time", selectedTime || "—"],["Duration", duration?.label || "—"],["Patient", patientName || "—"],["Address", address || "—"]].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:12, marginBottom:12, borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{k}</span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy, maxWidth:220, textAlign:"right" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:C.navy }}>Total</span>
                    <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.gold }}>₹{totalCost || 1440}</span>
                  </div>
                </div>
                <div style={{ background:"rgba(5,150,105,0.06)", border:"1px solid rgba(5,150,105,0.2)", borderRadius:10, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>ℹ️</span>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#065F46", lineHeight:1.6 }}>Payment is collected after service delivery. You will receive a confirmation SMS and email once confirmed.</p>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display:"flex", gap:12, marginTop:28 }}>
              {step > 0 && <button onClick={() => setStep(s => s-1)} style={{ flex:1, padding:"12px 0", borderRadius:10, border:`1.5px solid ${C.border}`, background:"transparent", fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, cursor:"pointer" }}>← Back</button>}
              {step < 3
                ? <button onClick={() => setStep(s => s+1)} style={{ flex:2, padding:"12px 0", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:C.navy, cursor:"pointer" }}>Continue →</button>
                : <button onClick={confirm} disabled={loading} style={{ flex:2, padding:"12px 0", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:C.navy, cursor:"pointer" }}>
                    {loading ? "Confirming…" : "✓ Confirm Booking"}
                  </button>
              }
            </div>
          </div>

          {/* Right: summary card */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:24, position:"sticky", top:24 }}>
            <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:C.navy, marginBottom:16 }}>Booking Summary</h3>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:C.gold }}>NJ</div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:C.navy }}>Neha Joshi, RN</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>★ 4.9 · 142 reviews</div>
              </div>
            </div>
            {[["Service", service || "—"],["Date", selectedDay !== null ? `${days[selectedDay].getDate()} ${MONTH_NAMES[days[selectedDay].getMonth()]}` : "—"],["Time", selectedTime || "—"],["Duration", duration?.label || "—"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{k}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:C.navy }}>Total</span>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.gold }}>{totalCost ? `₹${totalCost}` : "—"}</span>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.muted, marginTop:6 }}>Pay after service · No hidden charges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

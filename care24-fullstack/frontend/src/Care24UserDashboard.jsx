import { useState } from "react";

const C = {
  navy:"#0F1F3D",navyLight:"#1A3260",gold:"#D4A853",goldLight:"#F0C97A",
  cream:"#FAF7F2",white:"#FFFFFF",text:"#1A1A2E",muted:"#6B7280",
  softBg:"#F4EFE8",border:"#E8E0D5",success:"#059669",error:"#DC2626",warning:"#D97706",
};

const BOOKINGS = [
  { id:"C24-10482", caregiver:"Neha Joshi, RN", service:"Nursing Care", date:"Today, 2 Jun", time:"09:00 AM", duration:"4 Hours", status:"active", avatar:"NJ", price:"₹1,440", progress:60 },
  { id:"C24-10465", caregiver:"Pradeep Kumar", service:"Physiotherapy", date:"Tomorrow, 3 Jun", time:"10:00 AM", duration:"2 Hours", status:"upcoming", avatar:"PK", price:"₹1,800", progress:0 },
  { id:"C24-10441", caregiver:"Sunita Rao", service:"Elderly Attendant", date:"28 May 2025", time:"08:00 AM", duration:"8 Hours", status:"completed", avatar:"SR", price:"₹1,760", progress:100 },
  { id:"C24-10398", caregiver:"Anjali Mehta", service:"Nursing Care", date:"20 May 2025", time:"09:00 AM", duration:"4 Hours", status:"completed", avatar:"AM", price:"₹1,440", progress:100 },
  { id:"C24-10350", caregiver:"Meena Thomas", service:"Dementia Care", date:"10 May 2025", time:"08:00 AM", duration:"Full Day", status:"cancelled", avatar:"MT", price:"₹3,520", progress:0 },
];

const STATUS = {
  active:   { label:"In Progress", bg:"rgba(5,150,105,0.1)",  color:C.success,  dot:"#10B981" },
  upcoming: { label:"Upcoming",    bg:"rgba(212,168,83,0.12)", color:"#92600A",  dot:C.gold },
  completed:{ label:"Completed",   bg:"rgba(59,130,246,0.1)", color:"#1D4ED8",  dot:"#3B82F6" },
  cancelled:{ label:"Cancelled",   bg:"rgba(220,38,38,0.1)",  color:C.error,    dot:C.error },
};

const STATS = [
  { icon:"📋", label:"Total Bookings",  value:"12" },
  { icon:"✅", label:"Completed",       value:"9" },
  { icon:"⭐", label:"Avg Rating Given", value:"4.8" },
  { icon:"💰", label:"Total Spent",     value:"₹18,400" },
];

const CARE_NOTES = [
  { date:"Today 09:45 AM", caregiver:"Neha Joshi", note:"Patient vitals normal. BP 120/80, pulse 72. Administered morning medication. Patient in good spirits.", type:"update" },
  { date:"Yesterday 10:30 AM", caregiver:"Neha Joshi", note:"Wound dressing changed successfully. Healing well. Recommended light walking exercise.", type:"update" },
  { date:"28 May", caregiver:"Sunita Rao", note:"Full day session completed. Patient enjoyed morning exercises and meals. Requested same caregiver for next visit.", type:"complete" },
];

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 16px", borderRadius:10, border:"none", background: active ? "rgba(212,168,83,0.12)" : "transparent", cursor:"pointer", transition:"all 0.2s" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight: active ? 600 : 400, color: active ? C.gold : "rgba(255,255,255,0.65)" }}>{label}</span>
      {active && <div style={{ width:3, height:20, background:C.gold, borderRadius:2, marginLeft:"auto" }} />}
    </button>
  );
}

function BookingCard({ b, onView }) {
  const s = STATUS[b.status];
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:20, transition:"box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:C.gold }}>{b.avatar}</div>
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:C.navy }}>{b.caregiver}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>{b.service}</div>
          </div>
        </div>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100, background:s.bg, color:s.color }}>
          ● {s.label}
        </span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[["📅",b.date],["🕐",b.time],["⏱",b.duration]].map(([icon,val]) => (
          <div key={val} style={{ background:C.softBg, borderRadius:8, padding:"8px 10px", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:12 }}>{icon}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.text }}>{val}</span>
          </div>
        ))}
      </div>

      {b.status === "active" && (
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>Service progress</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:C.success }}>{b.progress}%</span>
          </div>
          <div style={{ height:6, background:C.softBg, borderRadius:10, overflow:"hidden" }}>
            <div style={{ width:`${b.progress}%`, height:"100%", background:`linear-gradient(90deg,${C.success},#34D399)`, borderRadius:10, transition:"width 0.5s" }} />
          </div>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:C.navy }}>{b.price}</span>
        <div style={{ display:"flex", gap:8 }}>
          {b.status === "active" && <button style={{ padding:"7px 14px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" }}>Track Live</button>}
          {b.status === "completed" && <button style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>⭐ Rate</button>}
          <button onClick={() => onView(b)} style={{ padding:"7px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>View Details</button>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard({ onNavigate }) {
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = filter === "all" ? BOOKINGS : BOOKINGS.filter(b => b.status === filter);

  const activeBooking = BOOKINGS.find(b => b.status === "active");

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:C.cream, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* Sidebar */}
      <div style={{ width:240, background:C.navy, padding:"24px 16px", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 16px", marginBottom:24, cursor:"pointer" }} onClick={() => onNavigate && onNavigate("landing")}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>❤</div>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:C.white }}>Care<span style={{ color:C.gold }}>24</span></span>
        </div>

        {/* User avatar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(255,255,255,0.05)", borderRadius:10, marginBottom:16 }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:C.navy }}>RS</div>
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.white }}>Rajesh Sharma</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(255,255,255,0.45)" }}>Family Account</div>
          </div>
        </div>

        {[{ icon:"🏠", label:"Overview", id:"overview" },{ icon:"📋", label:"My Bookings", id:"bookings" },{ icon:"📝", label:"Care Notes", id:"notes" },{ icon:"👤", label:"Patient Profile", id:"profile" },{ icon:"⚙️", label:"Settings", id:"settings" }].map(item => (
          <NavItem key={item.id} icon={item.icon} label={item.label} active={tab === item.id} onClick={() => setTab(item.id)} />
        ))}

        <div style={{ marginTop:"auto", paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <NavItem icon="➕" label="Book New Care" onClick={() => onNavigate && onNavigate("booking")} />
          <NavItem icon="🚪" label="Sign Out" onClick={() => onNavigate && onNavigate("auth")} />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 36px" }}>

        {/* Overview tab */}
        {tab === "overview" && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy }}>Good morning, Rajesh 👋</h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginTop:4 }}>Here's a summary of your care activity</p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 18px" }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:C.navy, marginBottom:4 }}>{s.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Active booking banner */}
            {activeBooking && (
              <div style={{ background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius:16, padding:24, marginBottom:28, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:"-20%", right:"-5%", width:200, height:200, borderRadius:"50%", background:"rgba(212,168,83,0.1)", pointerEvents:"none" }} />
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#10B981", animation:"pulse 2s infinite" }} />
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#10B981" }}>Live Session</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
                  <div>
                    <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.white, marginBottom:4 }}>{activeBooking.service} in progress</h3>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(255,255,255,0.6)" }}>{activeBooking.caregiver} · Started {activeBooking.time}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.gold }}>{activeBooking.progress}%</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(255,255,255,0.5)" }}>Complete</div>
                  </div>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:10, marginTop:16, overflow:"hidden" }}>
                  <div style={{ width:`${activeBooking.progress}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.goldLight})`, borderRadius:10 }} />
                </div>
              </div>
            )}

            {/* Recent bookings */}
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy, marginBottom:16 }}>Recent Bookings</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {BOOKINGS.slice(0,3).map(b => <BookingCard key={b.id} b={b} onView={setSelected} />)}
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {tab === "bookings" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div>
                <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy }}>My Bookings</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginTop:4 }}>Manage and track all your care sessions</p>
              </div>
              <button onClick={() => onNavigate && onNavigate("booking")} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, border:"none", padding:"11px 22px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>+ Book New Care</button>
            </div>

            {/* Filter tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              {["all","active","upcoming","completed","cancelled"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding:"8px 16px", borderRadius:100, border:`1.5px solid ${filter === f ? C.gold : C.border}`, background: filter === f ? "rgba(212,168,83,0.1)" : C.white, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: filter === f ? 600 : 400, color: filter === f ? C.navy : C.muted, cursor:"pointer", transition:"all 0.2s", textTransform:"capitalize" }}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {filtered.map(b => <BookingCard key={b.id} b={b} onView={setSelected} />)}
            </div>
          </div>
        )}

        {/* Care Notes tab */}
        {tab === "notes" && (
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:6 }}>Care Notes</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:28 }}>Updates from your caregivers after each session</p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {CARE_NOTES.map((n,i) => (
                <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:C.gold }}>
                        {n.caregiver.split(" ").map(w=>w[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy }}>{n.caregiver}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.muted }}>{n.date}</div>
                      </div>
                    </div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100, background: n.type === "complete" ? "rgba(59,130,246,0.1)" : "rgba(5,150,105,0.1)", color: n.type === "complete" ? "#1D4ED8" : C.success }}>
                      {n.type === "complete" ? "Session Complete" : "Progress Update"}
                    </span>
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.text, lineHeight:1.7 }}>{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patient Profile tab */}
        {tab === "profile" && (
          <div style={{ maxWidth:600 }}>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:28 }}>Patient Profile</h1>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:28 }}>
              {[{ label:"Full Name", val:"Ramesh Sharma" },{ label:"Age", val:"72 years" },{ label:"Relation", val:"Father" },{ label:"Blood Group", val:"B+" },{ label:"Primary Condition", val:"Post knee-replacement recovery" },{ label:"Secondary Conditions", val:"Type 2 Diabetes, Hypertension" },{ label:"Allergies", val:"Latex, Penicillin" },{ label:"Emergency Contact", val:"Rajesh Sharma · +91 98XXXXXXXX" }].map(f => (
                <div key={f.label} style={{ display:"flex", gap:16, paddingBottom:16, marginBottom:16, borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, width:160, flexShrink:0 }}>{f.label}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:C.navy }}>{f.val}</span>
                </div>
              ))}
              <button style={{ padding:"11px 24px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>Edit Profile</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }} onClick={() => setSelected(null)}>
          <div style={{ background:C.white, borderRadius:20, padding:32, width:"100%", maxWidth:460 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy }}>Booking {selected.id}</h3>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.muted }}>✕</button>
            </div>
            {Object.entries({ Caregiver:selected.caregiver, Service:selected.service, Date:selected.date, Time:selected.time, Duration:selected.duration, Amount:selected.price, Status:STATUS[selected.status].label }).map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", paddingBottom:12, marginBottom:12, borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{k}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

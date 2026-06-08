import { useState } from "react";

const C = {
  navy:"#0F1F3D",navyLight:"#1A3260",gold:"#D4A853",goldLight:"#F0C97A",
  cream:"#FAF7F2",white:"#FFFFFF",text:"#1A1A2E",muted:"#6B7280",
  softBg:"#F4EFE8",border:"#E8E0D5",success:"#059669",error:"#DC2626",
};

const PENDING_CAREGIVERS = [
  { id:1, name:"Divya Nair", role:"Home Nurse", exp:"3 yrs", location:"Kochi", submitted:"2 hours ago", avatar:"DN", docs:["ID Proof","Nursing Certificate","Background Check"] },
  { id:2, name:"Karthik Rajan", role:"Physiotherapist", exp:"5 yrs", location:"Chennai", submitted:"5 hours ago", avatar:"KR", docs:["ID Proof","BPT Certificate"] },
  { id:3, name:"Pooja Sharma", role:"Geriatric Specialist", exp:"8 yrs", location:"Delhi", submitted:"1 day ago", avatar:"PS", docs:["ID Proof","M.Sc Nursing","Background Check","References"] },
];

const ALL_CAREGIVERS = [
  { id:1, name:"Neha Joshi", role:"Registered Nurse", status:"active", rating:4.9, bookings:142, joined:"Jan 2024", location:"Mumbai" },
  { id:2, name:"Pradeep Kumar", role:"Physiotherapist", status:"active", rating:4.8, bookings:98, joined:"Mar 2024", location:"Pune" },
  { id:3, name:"Sunita Rao", role:"Senior Caregiver", status:"inactive", rating:4.9, bookings:210, joined:"Nov 2023", location:"Bangalore" },
  { id:4, name:"Meena Thomas", role:"Geriatric Specialist", status:"active", rating:5.0, bookings:178, joined:"Dec 2023", location:"Kochi" },
];

const RECENT_BOOKINGS = [
  { id:"C24-10482", user:"Rajesh Sharma", caregiver:"Neha Joshi", service:"Nursing Care", date:"Today", amount:"₹1,440", status:"active" },
  { id:"C24-10481", user:"Priya Mehta", caregiver:"Pradeep Kumar", service:"Physiotherapy", date:"Today", amount:"₹1,800", status:"upcoming" },
  { id:"C24-10480", user:"Amit Joshi", caregiver:"Meena Thomas", service:"Dementia Care", date:"Yesterday", amount:"₹3,520", status:"completed" },
  { id:"C24-10479", user:"Kavya Rao", caregiver:"Sunita Rao", service:"Elderly Attendant", date:"Yesterday", amount:"₹1,600", status:"completed" },
  { id:"C24-10478", user:"Ravi Nair", caregiver:"Anjali Mehta", service:"Nursing Care", date:"2 Jun", amount:"₹1,440", status:"cancelled" },
];

const STATS = [
  { icon:"👥", label:"Total Users",       value:"18,420", change:"+12%", up:true },
  { icon:"👩‍⚕️", label:"Verified Caregivers", value:"2,413",  change:"+8%",  up:true },
  { icon:"📋", label:"Bookings This Month", value:"1,284",  change:"+21%", up:true },
  { icon:"💰", label:"Revenue This Month",  value:"₹9.2L",  change:"+15%", up:true },
  { icon:"⭐", label:"Avg Satisfaction",    value:"4.86",   change:"+0.1", up:true },
  { icon:"⚡", label:"Avg Response Time",   value:"1.8 hrs", change:"-0.3", up:true },
];

const STATUS_STYLE = {
  active:    { bg:"rgba(5,150,105,0.1)",   color:C.success,  label:"Active" },
  upcoming:  { bg:"rgba(212,168,83,0.12)", color:"#92600A",  label:"Upcoming" },
  completed: { bg:"rgba(59,130,246,0.1)", color:"#1D4ED8",   label:"Completed" },
  cancelled: { bg:"rgba(220,38,38,0.1)",  color:C.error,     label:"Cancelled" },
  inactive:  { bg:"rgba(107,114,128,0.1)",color:C.muted,     label:"Inactive" },
};

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 16px", borderRadius:10, border:"none", background: active ? "rgba(212,168,83,0.12)" : "transparent", cursor:"pointer", transition:"all 0.2s" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight: active ? 600 : 400, color: active ? C.gold : "rgba(255,255,255,0.65)", flex:1, textAlign:"left" }}>{label}</span>
      {badge && <span style={{ background:C.error, color:C.white, borderRadius:100, padding:"1px 7px", fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>{badge}</span>}
      {active && <div style={{ width:3, height:20, background:C.gold, borderRadius:2 }} />}
    </button>
  );
}

export default function AdminDashboard({ onNavigate }) {
  const [tab, setTab] = useState("overview");
  const [pending, setPending] = useState(PENDING_CAREGIVERS);
  const [caregivers, setCaregivers] = useState(ALL_CAREGIVERS);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const approve = (id) => {
    setPending(p => p.filter(c => c.id !== id));
    showToast("Caregiver approved and onboarded ✓");
  };

  const reject = (id) => {
    setPending(p => p.filter(c => c.id !== id));
    showToast("Caregiver application rejected", "error");
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:C.cream, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, zIndex:999, background: toast.type === "error" ? C.error : C.success, color:C.white, padding:"12px 20px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, animation:"slideIn 0.3s ease", boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width:240, background:C.navy, padding:"24px 16px", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 16px", marginBottom:16, cursor:"pointer" }} onClick={() => onNavigate && onNavigate("landing")}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>❤</div>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:C.white }}>Care<span style={{ color:C.gold }}>24</span></span>
        </div>
        <div style={{ padding:"8px 16px", marginBottom:8 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:1.5 }}>Admin Panel</div>
        </div>
        {[
          { icon:"📊", label:"Overview",      id:"overview" },
          { icon:"✅", label:"Verifications",  id:"verify",   badge: pending.length },
          { icon:"👩‍⚕️", label:"Caregivers",    id:"caregivers" },
          { icon:"📋", label:"Bookings",       id:"bookings" },
          { icon:"👥", label:"Users",          id:"users" },
          { icon:"📈", label:"Analytics",      id:"analytics" },
          { icon:"🚨", label:"Complaints",     id:"complaints" },
        ].map(item => (
          <NavItem key={item.id} icon={item.icon} label={item.label} active={tab === item.id} badge={item.badge} onClick={() => setTab(item.id)} />
        ))}
        <div style={{ marginTop:"auto", paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"rgba(255,255,255,0.05)", borderRadius:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:C.navy }}>AD</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.white }}>Admin</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(255,255,255,0.4)" }}>Super Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 36px" }}>

        {/* Overview */}
        {tab === "overview" && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy }}>Admin Overview</h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginTop:4 }}>Platform health and activity summary</p>
            </div>

            {/* Stats grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <span style={{ fontSize:28 }}>{s.icon}</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color: s.up ? C.success : C.error, background: s.up ? "rgba(5,150,105,0.1)" : "rgba(220,38,38,0.1)", padding:"3px 8px", borderRadius:100 }}>
                      {s.up ? "↑" : "↓"} {s.change}
                    </span>
                  </div>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:C.navy, marginBottom:4 }}>{s.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pending alert */}
            {pending.length > 0 && (
              <div onClick={() => setTab("verify")} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius:14, padding:"18px 24px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:24 }}>⚠️</span>
                  <div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:C.navy }}>{pending.length} caregivers awaiting verification</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"rgba(15,31,61,0.65)" }}>Review and approve their applications</div>
                  </div>
                </div>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy }}>Review Now →</span>
              </div>
            )}

            {/* Recent bookings */}
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy, marginBottom:16 }}>Recent Bookings</h2>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.softBg }}>
                    {["Booking ID","User","Caregiver","Service","Date","Amount","Status"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map((b,i) => {
                    const s = STATUS_STYLE[b.status];
                    return (
                      <tr key={b.id} style={{ borderTop:`1px solid ${C.border}`, background: i%2===0 ? C.white : "rgba(250,247,242,0.5)" }}>
                        {[b.id, b.user, b.caregiver, b.service, b.date, b.amount].map((val,j) => (
                          <td key={j} style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color: j===0 ? C.gold : C.text, fontWeight: j===0 ? 600 : 400 }}>{val}</td>
                        ))}
                        <td style={{ padding:"13px 16px" }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100, background:s.bg, color:s.color }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verification tab */}
        {tab === "verify" && (
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:6 }}>Caregiver Verifications</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:28 }}>{pending.length} applications pending review</p>

            {pending.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
                <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:C.navy }}>All caught up!</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginTop:8 }}>No pending verifications at this time.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                {pending.map(cg => (
                  <div key={cg.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
                    <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:18 }}>
                      <div style={{ width:52, height:52, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:C.gold, flexShrink:0 }}>{cg.avatar}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:16, color:C.navy }}>{cg.name}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{cg.role} · {cg.exp} exp. · {cg.location}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted, marginTop:2 }}>Submitted {cg.submitted}</div>
                      </div>
                      <div style={{ background:"rgba(212,168,83,0.12)", color:"#92600A", borderRadius:8, padding:"4px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600 }}>Pending Review</div>
                    </div>

                    <div style={{ marginBottom:18 }}>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Submitted Documents</div>
                      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                        {cg.docs.map(d => (
                          <div key={d} style={{ display:"flex", alignItems:"center", gap:6, background:C.softBg, borderRadius:8, padding:"6px 12px" }}>
                            <span style={{ fontSize:14 }}>📄</span>
                            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.navy }}>{d}</span>
                            <span style={{ fontSize:12, color:C.success }}>✓</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display:"flex", gap:12 }}>
                      <button onClick={() => approve(cg.id)} style={{ flex:1, padding:"11px 0", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.success},#34D399)`, color:C.white, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>✓ Approve & Onboard</button>
                      <button onClick={() => reject(cg.id)} style={{ flex:1, padding:"11px 0", borderRadius:10, border:`1.5px solid ${C.error}`, background:"transparent", color:C.error, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>✕ Reject Application</button>
                      <button style={{ padding:"11px 20px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"transparent", color:C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:14, cursor:"pointer" }}>Request Info</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Caregivers tab */}
        {tab === "caregivers" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div>
                <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy }}>Manage Caregivers</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginTop:4 }}>All verified caregivers on the platform</p>
              </div>
            </div>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.softBg }}>
                    {["Name","Role","Location","Rating","Bookings","Joined","Status","Action"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {caregivers.map((cg,i) => {
                    const s = STATUS_STYLE[cg.status];
                    return (
                      <tr key={cg.id} style={{ borderTop:`1px solid ${C.border}`, background: i%2===0 ? C.white : "rgba(250,247,242,0.5)" }}>
                        <td style={{ padding:"13px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.gold }}>
                              {cg.name.split(" ").map(w=>w[0]).join("")}
                            </div>
                            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.navy }}>{cg.name}</span>
                          </div>
                        </td>
                        <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.text }}>{cg.role}</td>
                        <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.text }}>{cg.location}</td>
                        <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.gold, fontWeight:600 }}>★ {cg.rating}</td>
                        <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.text }}>{cg.bookings}</td>
                        <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{cg.joined}</td>
                        <td style={{ padding:"13px 16px" }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100, background:s.bg, color:s.color }}>{s.label}</span>
                        </td>
                        <td style={{ padding:"13px 16px" }}>
                          <button
                            onClick={() => { setCaregivers(list => list.map(c => c.id === cg.id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c)); showToast(`Caregiver ${cg.status === "active" ? "deactivated" : "activated"}`); }}
                            style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>
                            {cg.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {tab === "bookings" && (
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:6 }}>All Bookings</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:24 }}>Platform-wide booking activity</p>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.softBg }}>
                    {["ID","User","Caregiver","Service","Date","Amount","Status"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map((b,i) => {
                    const s = STATUS_STYLE[b.status];
                    return (
                      <tr key={b.id} style={{ borderTop:`1px solid ${C.border}`, background: i%2===0 ? C.white : "rgba(250,247,242,0.5)" }}>
                        {[b.id, b.user, b.caregiver, b.service, b.date, b.amount].map((val,j) => (
                          <td key={j} style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color: j===0 ? C.gold : C.text, fontWeight: j===0 ? 600 : 400 }}>{val}</td>
                        ))}
                        <td style={{ padding:"13px 16px" }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100, background:s.bg, color:s.color }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics tab */}
        {tab === "analytics" && (
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:6 }}>Analytics & KPIs</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:28 }}>Key performance indicators for the platform</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
              {[{ title:"Booking Completion Rate", value:"87.4%", sub:"Target: 90%", bar:87 },{ title:"Caregiver Acceptance Rate", value:"92.1%", sub:"Target: 85%", bar:92 },{ title:"User Retention (30d)", value:"73.6%", sub:"Target: 70%", bar:74 },{ title:"Avg. Response Time", value:"1.8 hrs", sub:"Target: < 2 hrs", bar:80 }].map(k => (
                <div key={k.title} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, marginBottom:8 }}>{k.title}</div>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:C.navy, marginBottom:4 }}>{k.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.success, marginBottom:14 }}>✓ {k.sub}</div>
                  <div style={{ height:8, background:C.softBg, borderRadius:8, overflow:"hidden" }}>
                    <div style={{ width:`${k.bar}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.goldLight})`, borderRadius:8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === "users" || tab === "complaints") && (
          <div style={{ textAlign:"center", padding:"100px 0" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>{tab === "users" ? "👥" : "🚨"}</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:C.navy, marginBottom:8 }}>{tab === "users" ? "User Management" : "Complaints"}</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted }}>This section is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}

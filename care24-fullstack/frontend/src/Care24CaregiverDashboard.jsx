import { useState, useEffect } from "react";
import * as API from "./api";

const C = {
  navy:"#0F1F3D",navyLight:"#1A3260",gold:"#D4A853",goldLight:"#F0C97A",
  cream:"#FAF7F2",white:"#FFFFFF",text:"#1A1A2E",muted:"#6B7280",
  softBg:"#F4EFE8",border:"#E8E0D5",success:"#059669",error:"#DC2626",
};

const STATUS_STYLE = {
  pending:   { bg:"rgba(212,168,83,0.12)", color:"#92600A",  label:"Pending" },
  accepted:  { bg:"rgba(5,150,105,0.1)",  color:C.success,  label:"Accepted" },
  active:    { bg:"rgba(5,150,105,0.15)", color:C.success,  label:"In Progress" },
  completed: { bg:"rgba(59,130,246,0.1)", color:"#1D4ED8",  label:"Completed" },
  cancelled: { bg:"rgba(220,38,38,0.1)", color:C.error,     label:"Cancelled" },
  rejected:  { bg:"rgba(220,38,38,0.1)", color:C.error,     label:"Rejected" },
};

// ── Demo fallback data (used when backend is offline) ──
const DEMO_PROFILE = {
  qualification:"GNM – General Nursing & Midwifery", experience:6,
  services:["Nursing Care","Post-Hospital Care"], location:"Mumbai",
  pricePerHour:800, rating:4.9, totalReviews:142,
  isAvailable:true, status:"verified", earnings:48600, totalBookings:64,
  user:{ firstName:"Neha", lastName:"Joshi", email:"neha@care24.com", phone:"9800000001" },
};
const DEMO_BOOKINGS = [
  { _id:"1", referenceId:"C24-10482", status:"active",    progress:60,  service:"Nursing Care",    date:"2025-06-02", time:"09:00 AM", duration:4,  totalAmount:3200, user:{ firstName:"Rajesh",  lastName:"Sharma", phone:"9800000002" }, patient:{ name:"Ramesh Sharma", age:72 } },
  { _id:"2", referenceId:"C24-10475", status:"pending",   progress:0,   service:"Post-Hospital",   date:"2025-06-03", time:"10:00 AM", duration:8,  totalAmount:6400, user:{ firstName:"Priya",   lastName:"Mehta",  phone:"9800000003" }, patient:{ name:"Sundar Mehta",  age:68 } },
  { _id:"3", referenceId:"C24-10460", status:"completed", progress:100, service:"Nursing Care",    date:"2025-05-28", time:"08:00 AM", duration:4,  totalAmount:3200, user:{ firstName:"Amit",    lastName:"Joshi",  phone:"9800000004" }, patient:{ name:"Kamla Joshi",   age:74 } },
  { _id:"4", referenceId:"C24-10441", status:"completed", progress:100, service:"Medication",      date:"2025-05-20", time:"09:00 AM", duration:2,  totalAmount:1600, user:{ firstName:"Kavya",   lastName:"Rao",    phone:"9800000005" }, patient:{ name:"Gopal Rao",     age:80 } },
];

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 16px", borderRadius:10, border:"none", background: active ? "rgba(212,168,83,0.12)" : "transparent", cursor:"pointer", transition:"all 0.2s" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:active?600:400, color:active?C.gold:"rgba(255,255,255,0.65)", flex:1, textAlign:"left" }}>{label}</span>
      {badge && <span style={{ background:C.error, color:C.white, borderRadius:100, padding:"1px 7px", fontSize:11, fontWeight:700 }}>{badge}</span>}
      {active && <div style={{ width:3, height:20, background:C.gold, borderRadius:2 }} />}
    </button>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", top:24, right:24, zIndex:999, background:type==="error"?C.error:C.success, color:C.white, padding:"12px 20px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"slideIn 0.3s ease" }}>
      {msg}
    </div>
  );
}

export default function CaregiverDashboard({ onNavigate }) {
  const [tab, setTab]         = useState("overview");
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [noteModal, setNoteModal] = useState(null);
  const [noteText, setNoteText]   = useState("");
  const [editForm, setEditForm]   = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);

  const showToast = (msg, type="success") => setToast({ msg, type });

  const load = async () => {
    setLoading(true);
    try {
      const [cgRes, bkRes] = await Promise.all([
        API.getMyCaregiverProfile(),
        API.getCaregiverBookings(),
      ]);
      setProfile(cgRes.caregiver);
      setBookings(bkRes.bookings);
      setEditForm(cgRes.caregiver);
    } catch {
      // Backend offline — use demo data
      setProfile(DEMO_PROFILE);
      setBookings(DEMO_BOOKINGS);
      setEditForm(DEMO_PROFILE);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleAvail = async () => {
    try {
      const res = await API.toggleAvailability();
      setProfile(p => ({ ...p, isAvailable: res.isAvailable }));
      showToast(`Status set to ${res.isAvailable ? "Available" : "Busy"}`);
    } catch {
      setProfile(p => ({ ...p, isAvailable: !p.isAvailable }));
      showToast("Availability updated (demo mode)");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.updateBookingStatus(id, { status });
      setBookings(bs => bs.map(b => b._id === id ? { ...b, status } : b));
      showToast(`Booking ${status}`);
    } catch {
      setBookings(bs => bs.map(b => b._id === id ? { ...b, status } : b));
      showToast(`Booking ${status} (demo mode)`);
    }
  };

  const updateProgress = async (id, progress) => {
    try {
      await API.updateBookingStatus(id, { progress });
      setBookings(bs => bs.map(b => b._id === id ? { ...b, progress } : b));
    } catch {
      setBookings(bs => bs.map(b => b._id === id ? { ...b, progress } : b));
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      await API.addCareNote({ booking: noteModal._id, note: noteText, type:"update" });
      showToast("Care note added ✓");
    } catch {
      showToast("Note saved (demo mode)");
    }
    setNoteText(""); setNoteModal(null);
  };

  const saveProfile = async () => {
    try {
      const res = await API.updateCaregiverProfile(editForm);
      setProfile(res.caregiver);
      showToast("Profile updated ✓");
    } catch {
      setProfile(f => ({ ...f, ...editForm }));
      showToast("Profile updated (demo mode)");
    }
    setEditMode(false);
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.cream }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.muted }}>Loading dashboard…</p>
      </div>
    </div>
  );

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const activeBooking = bookings.find(b => b.status === "active");
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const totalEarnings = profile?.earnings || bookings.filter(b=>b.status==="completed").reduce((s,b)=>s+b.totalAmount,0);

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:C.cream, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        input,select,textarea{font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <div style={{ width:240, background:C.navy, padding:"24px 16px", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 16px", marginBottom:16, cursor:"pointer" }} onClick={() => onNavigate?.("landing")}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>❤</div>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:C.white }}>Care<span style={{ color:C.gold }}>24</span></span>
        </div>

        {/* Caregiver avatar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(255,255,255,0.05)", borderRadius:10, marginBottom:16 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:C.navy }}>
            {profile?.user?.firstName?.[0]}{profile?.user?.lastName?.[0]}
          </div>
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.white }}>{profile?.user?.firstName} {profile?.user?.lastName}</div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background: profile?.isAvailable ? "#10B981" : C.muted, animation: profile?.isAvailable ? "pulse 2s infinite" : "none" }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"rgba(255,255,255,0.45)" }}>{profile?.isAvailable ? "Available" : "Busy"}</span>
            </div>
          </div>
        </div>

        {[
          { icon:"🏠", label:"Overview",        id:"overview" },
          { icon:"📋", label:"Requests",         id:"requests",  badge: pendingCount || null },
          { icon:"📅", label:"My Schedule",      id:"schedule" },
          { icon:"📝", label:"Care Notes",        id:"notes" },
          { icon:"💰", label:"Earnings",          id:"earnings" },
          { icon:"👤", label:"My Profile",        id:"profile" },
        ].map(item => (
          <NavItem key={item.id} icon={item.icon} label={item.label} active={tab===item.id} badge={item.badge} onClick={() => setTab(item.id)} />
        ))}

        <div style={{ marginTop:"auto", paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={toggleAvail} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 16px", borderRadius:10, border:"none", background: profile?.isAvailable ? "rgba(220,38,38,0.15)" : "rgba(5,150,105,0.15)", cursor:"pointer" }}>
            <span style={{ fontSize:18 }}>{profile?.isAvailable ? "🔴" : "🟢"}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color: profile?.isAvailable ? "#FCA5A5" : "#6EE7B7" }}>
              {profile?.isAvailable ? "Go Offline" : "Go Online"}
            </span>
          </button>
          <NavItem icon="🚪" label="Sign Out" onClick={() => { API.clearAuth(); onNavigate?.("auth"); }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 36px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy }}>Good morning, {profile?.user?.firstName} 👋</h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginTop:4 }}>Here's your activity summary</p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
              {[
                { icon:"⭐", label:"Your Rating",      value: profile?.rating?.toFixed(1) || "4.9" },
                { icon:"📋", label:"Total Bookings",   value: profile?.totalBookings || bookings.length },
                { icon:"✅", label:"Completed",        value: completedCount },
                { icon:"💰", label:"Total Earnings",   value: `₹${totalEarnings?.toLocaleString() || 0}` },
              ].map(s => (
                <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 18px" }}>
                  <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:C.navy, marginBottom:4 }}>{s.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Active session */}
            {activeBooking && (
              <div style={{ background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius:16, padding:24, marginBottom:28 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#10B981", animation:"pulse 2s infinite" }} />
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#10B981" }}>Active Session</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16, marginBottom:16 }}>
                  <div>
                    <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.white, marginBottom:4 }}>{activeBooking.service}</h3>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"rgba(255,255,255,0.6)" }}>
                      {activeBooking.user?.firstName} {activeBooking.user?.lastName}
                      {activeBooking.patient && ` · Patient: ${activeBooking.patient.name}`}
                    </p>
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    <button onClick={() => setNoteModal(activeBooking)} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:C.white, fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer" }}>+ Add Note</button>
                    <button onClick={() => updateStatus(activeBooking._id, "completed")} style={{ padding:"9px 18px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer" }}>Mark Complete ✓</button>
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(255,255,255,0.5)" }}>Progress</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:C.gold }}>{activeBooking.progress}%</span>
                  </div>
                  <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden", marginBottom:8 }}>
                    <div style={{ width:`${activeBooking.progress}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.goldLight})`, borderRadius:10 }} />
                  </div>
                  <input type="range" min="0" max="100" value={activeBooking.progress}
                    onChange={e => updateProgress(activeBooking._id, parseInt(e.target.value))}
                    style={{ width:"100%", accentColor:C.gold, cursor:"pointer" }} />
                </div>
              </div>
            )}

            {/* Pending requests */}
            {pendingCount > 0 && (
              <div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy, marginBottom:16 }}>Pending Requests ({pendingCount})</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {bookings.filter(b => b.status === "pending").map(b => (
                    <BookingCard key={b._id} b={b} onAccept={() => updateStatus(b._id,"accepted")} onReject={() => updateStatus(b._id,"rejected")} onNote={() => setNoteModal(b)} onView={() => setSelectedBooking(b)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── REQUESTS / SCHEDULE ── */}
        {(tab === "requests" || tab === "schedule") && (
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:6 }}>{tab === "requests" ? "Booking Requests" : "My Schedule"}</h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:24 }}>Manage all your care sessions</p>

            {/* Filter tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
              {["all","pending","accepted","active","completed","cancelled"].map(f => {
                const [filter, setFilter] = useState("all");
                return null; // handled below
              })}
            </div>
            <BookingList bookings={bookings} onAccept={(id) => updateStatus(id,"accepted")} onReject={(id) => updateStatus(id,"rejected")} onNote={setNoteModal} onView={setSelectedBooking} onComplete={(id) => updateStatus(id,"completed")} />
          </div>
        )}

        {/* ── CARE NOTES ── */}
        {tab === "notes" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div>
                <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy }}>Care Notes</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginTop:4 }}>Add notes to active bookings</p>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {bookings.filter(b => ["active","accepted"].includes(b.status)).map(b => (
                <div key={b._id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:C.navy }}>{b.service} — {b.user?.firstName} {b.user?.lastName}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>{b.referenceId} · {b.time}</div>
                    </div>
                    <button onClick={() => setNoteModal(b)} style={{ padding:"8px 16px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Note</button>
                  </div>
                  {b.patient && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>Patient: {b.patient.name}, Age {b.patient.age}</p>}
                </div>
              ))}
              {bookings.filter(b => ["active","accepted"].includes(b.status)).length === 0 && (
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>📝</div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted }}>No active sessions to add notes to.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EARNINGS ── */}
        {tab === "earnings" && (
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:28 }}>Earnings</h1>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
              {[
                { label:"Total Earned",   value:`₹${totalEarnings?.toLocaleString()}`,  icon:"💰" },
                { label:"This Month",     value:`₹${Math.round(totalEarnings*0.3).toLocaleString()}`, icon:"📅" },
                { label:"Sessions Done",  value:completedCount, icon:"✅" },
              ].map(s => (
                <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
                  <div style={{ fontSize:28, marginBottom:12 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy, marginBottom:4 }}>{s.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy, marginBottom:16 }}>Completed Sessions</h2>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:C.softBg }}>
                    {["Reference","Service","Patient","Date","Duration","Amount"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.filter(b => b.status === "completed").map((b,i) => (
                    <tr key={b._id} style={{ borderTop:`1px solid ${C.border}`, background:i%2===0?C.white:"rgba(250,247,242,0.5)" }}>
                      <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.gold, fontWeight:600 }}>{b.referenceId}</td>
                      <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>{b.service}</td>
                      <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>{b.patient?.name || "—"}</td>
                      <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{new Date(b.date).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>{b.duration} hrs</td>
                      <td style={{ padding:"13px 16px", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.success }}>₹{b.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <div style={{ maxWidth:620 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:C.navy }}>My Profile</h1>
              <button onClick={() => editMode ? saveProfile() : setEditMode(true)}
                style={{ padding:"10px 22px", borderRadius:10, border:"none", background: editMode ? `linear-gradient(135deg,${C.success},#34D399)` : `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: editMode ? C.white : C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                {editMode ? "Save Changes ✓" : "Edit Profile"}
              </button>
            </div>

            {/* Verification badge */}
            <div style={{ background: profile?.status==="verified" ? "rgba(5,150,105,0.08)" : "rgba(212,168,83,0.1)", border:`1px solid ${profile?.status==="verified" ? "rgba(5,150,105,0.2)" : "rgba(212,168,83,0.3)"}`, borderRadius:12, padding:"12px 18px", display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <span style={{ fontSize:20 }}>{profile?.status==="verified" ? "✅" : "⏳"}</span>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color: profile?.status==="verified" ? C.success : "#92600A" }}>
                  {profile?.status==="verified" ? "Verified Caregiver" : "Verification Pending"}
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted }}>
                  {profile?.status==="verified" ? "Your profile is approved and visible to families" : "Admin will review your profile within 24 hours"}
                </div>
              </div>
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:28 }}>
              {[
                { label:"First Name",     key:"firstName",     val:profile?.user?.firstName,   editable:false },
                { label:"Last Name",      key:"lastName",      val:profile?.user?.lastName,    editable:false },
                { label:"Email",          key:"email",         val:profile?.user?.email,       editable:false },
                { label:"Phone",          key:"phone",         val:profile?.user?.phone,       editable:false },
                { label:"Qualification",  key:"qualification", val:profile?.qualification,     editable:true  },
                { label:"Experience (yrs)",key:"experience",   val:profile?.experience,        editable:true  },
                { label:"Location",       key:"location",      val:profile?.location,          editable:true  },
                { label:"Price/Hour (₹)", key:"pricePerHour",  val:profile?.pricePerHour,      editable:true  },
                { label:"Rating",         key:"rating",        val:`★ ${profile?.rating} (${profile?.totalReviews} reviews)`, editable:false },
              ].map(f => (
                <div key={f.key} style={{ display:"flex", gap:16, alignItems:"center", paddingBottom:16, marginBottom:16, borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, width:160, flexShrink:0 }}>{f.label}</span>
                  {editMode && f.editable
                    ? <input value={editForm[f.key] || ""} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ flex:1, padding:"8px 12px", border:`1.5px solid ${C.gold}`, borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.navy, outline:"none" }} />
                    : <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:C.navy }}>{f.val || "—"}</span>
                  }
                </div>
              ))}

              {/* Services */}
              <div style={{ marginTop:8 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, display:"block", marginBottom:10 }}>Services Offered</span>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {(profile?.services || []).map(s => (
                    <span key={s} style={{ background:C.softBg, color:C.navy, borderRadius:8, padding:"5px 12px", fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {noteModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }} onClick={() => setNoteModal(null)}>
          <div style={{ background:C.white, borderRadius:20, padding:32, width:"100%", maxWidth:460 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy }}>Add Care Note</h3>
              <button onClick={() => setNoteModal(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.muted }}>✕</button>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, marginBottom:16 }}>
              {noteModal.service} · {noteModal.user?.firstName} {noteModal.user?.lastName}
            </p>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4}
              placeholder="e.g. Patient vitals normal. BP 120/80. Administered morning medication. Patient in good spirits."
              style={{ width:"100%", padding:"12px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.text, outline:"none", resize:"vertical", marginBottom:16 }} />
            <button onClick={addNote} style={{ width:"100%", padding:"12px 0", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>
              Save Note ✓
            </button>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }} onClick={() => setSelectedBooking(null)}>
          <div style={{ background:C.white, borderRadius:20, padding:32, width:"100%", maxWidth:460 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.navy }}>{selectedBooking.referenceId}</h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.muted }}>✕</button>
            </div>
            {[["Service",selectedBooking.service],["Family",`${selectedBooking.user?.firstName} ${selectedBooking.user?.lastName}`],["Phone",selectedBooking.user?.phone],["Patient",selectedBooking.patient?.name || "—"],["Patient Age",selectedBooking.patient?.age ? `${selectedBooking.patient.age} yrs` : "—"],["Date",new Date(selectedBooking.date).toLocaleDateString('en-IN')],["Time",selectedBooking.time],["Duration",`${selectedBooking.duration} hours`],["Amount",`₹${selectedBooking.totalAmount}`],["Address",selectedBooking.address || "—"],["Notes",selectedBooking.notes || "—"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", gap:12, paddingBottom:10, marginBottom:10, borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, width:110, flexShrink:0 }}>{k}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, color:C.navy }}>{v}</span>
              </div>
            ))}
            {selectedBooking.status === "pending" && (
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button onClick={() => { updateStatus(selectedBooking._id,"accepted"); setSelectedBooking(null); }} style={{ flex:1, padding:"11px 0", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.success},#34D399)`, color:C.white, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>✓ Accept</button>
                <button onClick={() => { updateStatus(selectedBooking._id,"rejected"); setSelectedBooking(null); }} style={{ flex:1, padding:"11px 0", borderRadius:10, border:`1.5px solid ${C.error}`, background:"transparent", color:C.error, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer" }}>✕ Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── BookingList sub-component ──
function BookingList({ bookings, onAccept, onReject, onNote, onView, onComplete }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {["all","pending","accepted","active","completed","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:"8px 16px", borderRadius:100, border:`1.5px solid ${filter===f?"#D4A853":"#E8E0D5"}`, background:filter===f?"rgba(212,168,83,0.1)":"white", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:filter===f?600:400, color:filter===f?"#0F1F3D":"#6B7280", cursor:"pointer", textTransform:"capitalize" }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(b => <BookingCard key={b._id} b={b} onAccept={() => onAccept(b._id)} onReject={() => onReject(b._id)} onNote={() => onNote(b)} onView={() => onView(b)} onComplete={() => onComplete(b._id)} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#6B7280" }}>No {filter === "all" ? "" : filter} bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BookingCard sub-component ──
function BookingCard({ b, onAccept, onReject, onNote, onView, onComplete }) {
  const s = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
  return (
    <div style={{ background:"#FFFFFF", border:"1px solid #E8E0D5", borderRadius:14, padding:20, transition:"box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, color:"#0F1F3D" }}>{b.service}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#6B7280" }}>{b.referenceId} · {b.user?.firstName} {b.user?.lastName}</div>
          {b.patient && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#6B7280" }}>Patient: {b.patient.name}, Age {b.patient.age}</div>}
        </div>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100, background:s.bg, color:s.color }}>● {s.label}</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
        {[["📅", new Date(b.date).toLocaleDateString('en-IN')],["🕐",b.time],["⏱",`${b.duration} hrs`]].map(([icon,val]) => (
          <div key={val} style={{ background:"#F4EFE8", borderRadius:8, padding:"8px 10px", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:12 }}>{icon}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"#1A1A2E" }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:"#0F1F3D" }}>₹{b.totalAmount}</span>
        <div style={{ display:"flex", gap:8 }}>
          {b.status === "pending" && (
            <>
              <button onClick={onAccept} style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"rgba(5,150,105,0.1)", color:"#059669", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" }}>✓ Accept</button>
              <button onClick={onReject} style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"rgba(220,38,38,0.1)", color:"#DC2626", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" }}>✕ Reject</button>
            </>
          )}
          {b.status === "active" && (
            <>
              <button onClick={onNote} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #E8E0D5", background:"transparent", color:"#0F1F3D", fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>+ Note</button>
              <button onClick={onComplete} style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"rgba(5,150,105,0.1)", color:"#059669", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer" }}>Complete ✓</button>
            </>
          )}
          <button onClick={onView} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #E8E0D5", background:"transparent", color:"#0F1F3D", fontFamily:"'DM Sans',sans-serif", fontSize:12, cursor:"pointer" }}>Details</button>
        </div>
      </div>
    </div>
  );
}

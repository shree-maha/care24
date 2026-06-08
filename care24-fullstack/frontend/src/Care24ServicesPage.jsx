import { useState } from "react";

const C = {
  navy:"#0F1F3D",navyLight:"#1A3260",gold:"#D4A853",goldLight:"#F0C97A",
  cream:"#FAF7F2",white:"#FFFFFF",text:"#1A1A2E",muted:"#6B7280",
  softBg:"#F4EFE8",border:"#E8E0D5",success:"#059669",
};

const SERVICES = [
  { id:1, icon:"🩺", title:"Nursing Care", tag:"Medical", price:"₹800/hr", desc:"Certified nurses for IV therapy, wound care, medication management and vitals monitoring." },
  { id:2, icon:"🧘", title:"Physiotherapy", tag:"Rehabilitation", price:"₹900/hr", desc:"Licensed physiotherapists for post-surgical recovery and mobility restoration." },
  { id:3, icon:"🤝", title:"Elderly Attendant", tag:"Personal Care", price:"₹500/hr", desc:"Compassionate companions for daily living, personal hygiene and emotional support." },
  { id:4, icon:"🏥", title:"Post-Hospital Care", tag:"Recovery", price:"₹1000/hr", desc:"Seamless recovery support after discharge — hospital-level care at home." },
  { id:5, icon:"💊", title:"Medication Support", tag:"Medical", price:"₹400/hr", desc:"Structured reminders, adherence tracking and coordination with providers." },
  { id:6, icon:"🧠", title:"Dementia Care", tag:"Specialized", price:"₹1100/hr", desc:"Specialists trained in cognitive support and safe environment management." },
];

const CAREGIVERS = [
  { id:1, name:"Neha Joshi", role:"Registered Nurse", exp:"6 yrs", rating:4.9, reviews:142, avatar:"NJ", services:["Nursing Care","Post-Hospital Care","IV Therapy"], price:"₹800/hr", available:true, location:"Mumbai", badge:"Top Rated" },
  { id:2, name:"Pradeep Kumar", role:"Physiotherapist", exp:"8 yrs", rating:4.8, reviews:98, avatar:"PK", services:["Physiotherapy","Post-Hospital Care"], price:"₹900/hr", available:true, location:"Pune", badge:"Verified" },
  { id:3, name:"Sunita Rao", role:"Senior Caregiver", exp:"10 yrs", rating:4.9, reviews:210, avatar:"SR", services:["Elderly Attendant","Dementia Care"], price:"₹550/hr", available:false, location:"Bangalore", badge:"Top Rated" },
  { id:4, name:"Anjali Mehta", role:"Home Nurse", exp:"4 yrs", rating:4.7, reviews:67, avatar:"AM", services:["Nursing Care","Medication Support"], price:"₹750/hr", available:true, location:"Mumbai", badge:"New" },
  { id:5, name:"Ravi Shankar", role:"Physiotherapist", exp:"5 yrs", rating:4.6, reviews:45, avatar:"RS", services:["Physiotherapy"], price:"₹850/hr", available:true, location:"Chennai", badge:"Verified" },
  { id:6, name:"Meena Thomas", role:"Geriatric Specialist", exp:"12 yrs", rating:5.0, reviews:178, avatar:"MT", services:["Dementia Care","Elderly Attendant","Medication Support"], price:"₹1100/hr", available:true, location:"Kochi", badge:"Expert" },
];

const BADGE_COLORS = {
  "Top Rated":{ bg:"rgba(212,168,83,0.15)", color:"#92600A" },
  "Verified":{ bg:"rgba(5,150,105,0.1)", color:C.success },
  "New":{ bg:"rgba(59,130,246,0.1)", color:"#1D4ED8" },
  "Expert":{ bg:"rgba(139,92,246,0.1)", color:"#6D28D9" },
};

function Stars({ rating }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      <div style={{ display:"flex", gap:1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize:12, color: i <= Math.round(rating) ? C.gold : "#E5E7EB" }}>★</span>
        ))}
      </div>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:C.text }}>{rating}</span>
    </div>
  );
}

function CaregiverCard({ cg, onBook }) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE_COLORS[cg.badge] || BADGE_COLORS["Verified"];
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background:C.white, border:`1.5px solid ${hovered ? C.gold : C.border}`, borderRadius:16, padding:24, transition:"all 0.25s", boxShadow: hovered ? "0 12px 40px rgba(15,31,61,0.12)" : "none", cursor:"default" }}>
      {/* Header */}
      <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
        <div style={{ width:54, height:54, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:16, fontWeight:700, color:C.gold, flexShrink:0 }}>{cg.avatar}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, color:C.navy }}>{cg.name}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:100, background:badge.bg, color:badge.color }}>{cg.badge}</span>
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted, marginTop:2 }}>{cg.role} · {cg.exp} exp.</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted, marginTop:2 }}>📍 {cg.location}</div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15, color:C.navy }}>{cg.price}</div>
          <div style={{ background: cg.available ? "rgba(5,150,105,0.1)" : "rgba(107,114,128,0.1)", color: cg.available ? C.success : C.muted, borderRadius:6, padding:"3px 8px", fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:600, marginTop:4 }}>
            {cg.available ? "● Available" : "● Busy"}
          </div>
        </div>
      </div>

      <Stars rating={cg.rating} />
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.muted, marginTop:2, marginBottom:14 }}>{cg.reviews} verified reviews</div>

      {/* Service tags */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
        {cg.services.map(s => (
          <span key={s} style={{ background:C.softBg, color:C.navy, borderRadius:6, padding:"4px 10px", fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>{s}</span>
        ))}
      </div>

      <button onClick={() => onBook(cg)} disabled={!cg.available}
        style={{ width:"100%", padding:"10px 0", borderRadius:10, border:"none", background: cg.available ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : C.border, color: cg.available ? C.navy : C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor: cg.available ? "pointer" : "not-allowed", transition:"all 0.2s" }}>
        {cg.available ? "Book Now →" : "Currently Unavailable"}
      </button>
    </div>
  );
}

export default function ServicesPage({ onNavigate }) {
  const [activeService, setActiveService] = useState("All");
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState("rating");
  const [showModal, setShowModal] = useState(null);

  const serviceFilters = ["All", ...SERVICES.map(s => s.title)];

  const filtered = CAREGIVERS
    .filter(cg => activeService === "All" || cg.services.includes(activeService))
    .filter(cg => cg.name.toLowerCase().includes(search.toLowerCase()) || cg.role.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy === "rating" ? b.rating - a.rating : parseInt(b.price) - parseInt(a.price));

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Topbar */}
      <div style={{ background:C.navy, padding:"16px 5vw", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => onNavigate && onNavigate("landing")}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>❤</div>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:C.white }}>Care<span style={{ color:C.gold }}>24</span></span>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={() => onNavigate && onNavigate("dashboard")} style={{ background:"rgba(255,255,255,0.1)", color:C.white, border:"1px solid rgba(255,255,255,0.2)", padding:"8px 18px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer" }}>My Dashboard</button>
          <button onClick={() => onNavigate && onNavigate("auth")} style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, border:"none", padding:"8px 18px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer" }}>Sign In</button>
        </div>
      </div>

      {/* Hero strip */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, padding:"48px 5vw 40px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(28px,4vw,44px)", color:C.white, marginBottom:10 }}>Find the right <span style={{ color:C.gold, fontStyle:"italic" }}>caregiver</span></h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"rgba(255,255,255,0.6)", marginBottom:28 }}>Browse verified professionals across all care categories</p>
          {/* Search */}
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:220, position:"relative" }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialty…"
                style={{ width:"100%", padding:"12px 14px 12px 42px", borderRadius:10, border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.text, outline:"none", background:C.white }} />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding:"12px 16px", borderRadius:10, border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.text, background:C.white, cursor:"pointer", outline:"none" }}>
              <option value="rating">Sort: Top Rated</option>
              <option value="price">Sort: Price</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 5vw" }}>
        {/* Service filter pills */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:32 }}>
          {serviceFilters.map(s => (
            <button key={s} onClick={() => setActiveService(s)}
              style={{ padding:"8px 18px", borderRadius:100, border:`1.5px solid ${activeService === s ? C.gold : C.border}`, background: activeService === s ? "rgba(212,168,83,0.12)" : C.white, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight: activeService === s ? 600 : 400, color: activeService === s ? C.navy : C.muted, cursor:"pointer", transition:"all 0.2s" }}>
              {s}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:24 }}>
          Showing <strong style={{ color:C.navy }}>{filtered.length}</strong> caregivers {activeService !== "All" && `for ${activeService}`}
        </div>

        {/* Caregiver grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:24 }}>
          {filtered.map(cg => <CaregiverCard key={cg.id} cg={cg} onBook={setShowModal} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 20px" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:C.navy, marginBottom:8 }}>No caregivers found</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted }}>Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      {/* Booking modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20 }} onClick={() => setShowModal(null)}>
          <div style={{ background:C.white, borderRadius:20, padding:32, width:"100%", maxWidth:440, position:"relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(null)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.muted }}>✕</button>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:`linear-gradient(135deg,${C.navy},${C.navyLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:C.gold }}>{showModal.avatar}</div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:16, color:C.navy }}>{showModal.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.muted }}>{showModal.role}</div>
              </div>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.muted, marginBottom:20 }}>Proceed to booking to select your schedule, duration and care details.</p>
            <button onClick={() => { setShowModal(null); onNavigate && onNavigate("booking"); }}
              style={{ width:"100%", padding:"13px 0", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.navy, fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:600, cursor:"pointer" }}>
              Continue to Booking →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

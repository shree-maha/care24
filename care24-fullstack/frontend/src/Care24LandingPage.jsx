import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#0F1F3D",
  navyLight: "#1A3260",
  gold: "#D4A853",
  goldLight: "#F0C97A",
  cream: "#FAF7F2",
  white: "#FFFFFF",
  text: "#1A1A2E",
  muted: "#6B7280",
  softBg: "#F4EFE8",
  border: "#E8E0D5",
};

const NAV_LINKS = ["Services", "How It Works", "Caregivers", "Testimonials", "Contact"];

const SERVICES = [
  { icon: "🩺", title: "Nursing Care", desc: "Certified nurses providing IV therapy, wound care, medication management and medical monitoring at home.", tag: "Medical" },
  { icon: "🧘", title: "Physiotherapy", desc: "Licensed physiotherapists for post-surgical recovery, mobility restoration and pain management exercises.", tag: "Rehabilitation" },
  { icon: "🤝", title: "Elderly Attendant", desc: "Compassionate companions assisting with daily living activities, personal hygiene and emotional support.", tag: "Personal Care" },
  { icon: "🏥", title: "Post-Hospital Care", desc: "Seamless recovery support after discharge — bridging hospital-level care to the comfort of home.", tag: "Recovery" },
  { icon: "💊", title: "Medication Support", desc: "Structured medication reminders, adherence tracking and coordination with your healthcare providers.", tag: "Medical" },
  { icon: "🧠", title: "Dementia Care", desc: "Specialized caregivers trained in cognitive support, safe environments and family guidance.", tag: "Specialized" },
];

const STEPS = [
  { num: "01", title: "Create a Profile", desc: "Register and share your loved one's age, medical needs and care preferences." },
  { num: "02", title: "Browse Caregivers", desc: "Explore verified profiles with qualifications, reviews and real availability." },
  { num: "03", title: "Book Instantly", desc: "Schedule hourly, daily or long-term care with just a few clicks." },
  { num: "04", title: "Track in Real Time", desc: "Receive live status updates and care notes directly to your phone." },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: "PS",
    text: "Care24 found us a wonderful night nurse within hours of my mother's hospital discharge. The caregiver was so professional and warm — mum actually looks forward to her visits now.",
    service: "Post-Hospital Care",
    rating: 5,
  },
  {
    name: "Rajesh Mehta",
    location: "Pune",
    avatar: "RM",
    text: "The physiotherapist has been incredible for my father's knee recovery. Real-time updates after every session give us peace of mind even when we can't be there.",
    service: "Physiotherapy",
    rating: 5,
  },
  {
    name: "Anita Kulkarni",
    location: "Nashik",
    avatar: "AK",
    text: "We've tried three other services. Care24 is the only one that actually vets their caregivers properly. The booking process is seamless and transparent.",
    service: "Elderly Attendant",
    rating: 5,
  },
];

const STATS = [
  { value: "2,400+", label: "Verified Caregivers" },
  { value: "18,000+", label: "Families Served" },
  { value: "4.9★", label: "Average Rating" },
  { value: "< 2 hrs", label: "Average Booking Time" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function StarRating({ count }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: COLORS.gold, fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(15,31,61,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(212,168,83,0.15)` : "none",
      transition: "all 0.35s ease",
      padding: "0 5vw",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 70,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>❤</div>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22, color: COLORS.white, letterSpacing: "-0.3px",
          }}>
            Care<span style={{ color: COLORS.gold }}>24</span>
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} style={{
              color: "rgba(255,255,255,0.78)", fontSize: 14, textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = COLORS.gold}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.78)"}
            >{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button style={{
            background: "transparent", border: `1px solid rgba(255,255,255,0.3)`,
            color: COLORS.white, padding: "8px 20px", borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = COLORS.white; }}
          >Sign In</button>
          <button style={{
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            border: "none", color: COLORS.navy,
            padding: "8px 22px", borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(212,168,83,0.4)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >Get Started</button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.cream}; }
        html { scroll-behavior: smooth; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </nav>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 55%, #243B6E 100%)`,
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "100px 5vw 80px",
    }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: "8%", right: "5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: "12%", width: 1, height: 200, background: `linear-gradient(to bottom, transparent, rgba(212,168,83,0.4), transparent)` }} />

      {/* Grid pattern overlay */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        {/* Left */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
            opacity: loaded ? 1 : 0, transition: "opacity 0.6s 0.1s",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.gold, display: "inline-block" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.goldLight, fontWeight: 500 }}>
              Trusted by 18,000+ families across India
            </span>
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(38px, 5.5vw, 64px)",
            color: COLORS.white, lineHeight: 1.12, marginBottom: 24,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.7s 0.2s",
          }}>
            Expert care,<br />
            <span style={{ color: COLORS.gold, fontStyle: "italic" }}>delivered</span> to<br />
            your doorstep.
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.75,
            color: "rgba(255,255,255,0.68)", marginBottom: 40, maxWidth: 460,
            opacity: loaded ? 1 : 0, transition: "opacity 0.7s 0.35s",
          }}>
            Connect with verified nurses, physiotherapists and caregivers for personalised in-home elderly care — booked in minutes, tracked in real time.
          </p>

          <div style={{
            display: "flex", gap: 14, flexWrap: "wrap",
            opacity: loaded ? 1 : 0, transition: "opacity 0.7s 0.5s",
          }}>
            <button style={{
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`,
              color: COLORS.navy, border: "none", padding: "14px 32px",
              borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, fontWeight: 600, cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(212,168,83,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >Book a Caregiver →</button>
            <button style={{
              background: "rgba(255,255,255,0.08)", color: COLORS.white,
              border: "1px solid rgba(255,255,255,0.2)", padding: "14px 28px",
              borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, cursor: "pointer", transition: "background 0.2s",
              backdropFilter: "blur(8px)",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >Watch How It Works</button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: "flex", gap: 24, marginTop: 48, flexWrap: "wrap",
            opacity: loaded ? 1 : 0, transition: "opacity 0.7s 0.65s",
          }}>
            {["✓ Background verified", "✓ Trained & certified", "✓ 24/7 support"].map(b => (
              <span key={b} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Right: floating card stack */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 420 }}>
          {/* Main card */}
          <div style={{
            background: COLORS.white, borderRadius: 20, padding: "28px 28px",
            width: 300, boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
            position: "relative", zIndex: 2,
            animation: "float 4s ease-in-out infinite",
            opacity: loaded ? 1 : 0, transition: "opacity 0.8s 0.6s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👩‍⚕️</div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: COLORS.text }}>Neha Joshi, RN</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>Registered Nurse · 6 yrs exp.</div>
              </div>
              <div style={{ marginLeft: "auto", background: "#ECFDF5", color: "#065F46", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Available</div>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {["Nursing Care", "Post-Op", "IV Therapy"].map(t => (
                <span key={t} style={{ background: COLORS.softBg, color: COLORS.navy, borderRadius: 6, padding: "4px 9px", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <StarRating count={5} />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted, marginTop: 2 }}>4.9 · 142 reviews</div>
              </div>
              <button style={{ background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Book Now</button>
            </div>
          </div>

          {/* Floating stat pill */}
          <div style={{
            position: "absolute", top: "12%", right: "-8%",
            background: COLORS.navy, border: `1px solid rgba(212,168,83,0.3)`,
            borderRadius: 12, padding: "12px 18px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)", zIndex: 3,
            animation: "float 5s ease-in-out infinite 1s",
            opacity: loaded ? 1 : 0, transition: "opacity 0.8s 0.8s",
          }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: COLORS.gold }}>2,400+</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Verified caregivers</div>
          </div>

          {/* Booking confirmation pill */}
          <div style={{
            position: "absolute", bottom: "10%", left: "-12%",
            background: COLORS.white, borderRadius: 12, padding: "12px 18px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.2)", zIndex: 3,
            display: "flex", alignItems: "center", gap: 10,
            animation: "float 4.5s ease-in-out infinite 0.5s",
            opacity: loaded ? 1 : 0, transition: "opacity 0.8s 1s",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✓</div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: COLORS.text }}>Booking confirmed!</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>Caregiver arrives at 9:00 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(212,168,83,0.6), transparent)" }} />
      </div>
    </section>
  );
}

function Stats() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ background: COLORS.navy, padding: "56px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            textAlign: "center", padding: "32px 16px",
            borderRight: i < 3 ? `1px solid rgba(255,255,255,0.08)` : "none",
            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.6s ${i * 0.1}s`,
          }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: COLORS.gold, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(null);

  return (
    <section id="services" ref={ref} style={{ background: COLORS.cream, padding: "100px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
            color: COLORS.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14,
            opacity: inView ? 1 : 0, transition: "opacity 0.6s",
          }}>What We Offer</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4vw, 48px)",
            color: COLORS.navy, marginBottom: 16, lineHeight: 1.2,
            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s 0.1s",
          }}>Comprehensive care for every need</h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.muted,
            maxWidth: 520, margin: "0 auto", lineHeight: 1.7,
            opacity: inView ? 1 : 0, transition: "opacity 0.6s 0.2s",
          }}>
            From post-surgical recovery to daily companionship, our verified caregivers deliver professional, personalised support.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {SERVICES.map((s, i) => (
            <div key={s.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? COLORS.navy : COLORS.white,
                border: `1px solid ${hovered === i ? "transparent" : COLORS.border}`,
                borderRadius: 16, padding: "32px 28px", cursor: "pointer",
                transition: "all 0.3s ease",
                transform: inView ? (hovered === i ? "translateY(-4px)" : "translateY(0)") : "translateY(28px)",
                opacity: inView ? 1 : 0,
                boxShadow: hovered === i ? "0 24px 60px rgba(15,31,61,0.25)" : "none",
                transitionDelay: inView ? `${i * 0.08}s` : "0s",
              }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: hovered === i ? COLORS.white : COLORS.navy }}>{s.title}</h3>
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                color: hovered === i ? COLORS.gold : COLORS.navy,
                background: hovered === i ? "rgba(212,168,83,0.15)" : COLORS.softBg,
                padding: "3px 10px", borderRadius: 100, marginBottom: 14, display: "inline-block",
              }}>{s.tag}</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: hovered === i ? "rgba(255,255,255,0.68)" : COLORS.muted, marginTop: 10 }}>{s.desc}</p>
              <div style={{ marginTop: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: hovered === i ? COLORS.gold : COLORS.navy }}>Book this service →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [ref, inView] = useInView();

  return (
    <section id="how-it-works" ref={ref} style={{ background: COLORS.softBg, padding: "100px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>How It Works</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 44px)", color: COLORS.navy, lineHeight: 1.2, marginBottom: 16, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s 0.1s" }}>
              Quality care in <em>four simple steps</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.muted, lineHeight: 1.7, marginBottom: 40, opacity: inView ? 1 : 0, transition: "opacity 0.6s 0.2s" }}>
              We've made finding trusted elderly care as easy as ordering food online — with the rigour and trust that healthcare demands.
            </p>
            <button style={{
              background: COLORS.navy, color: COLORS.white, border: "none",
              padding: "14px 30px", borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
              opacity: inView ? 1 : 0, transition: "opacity 0.6s 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.navyLight}
              onMouseLeave={e => e.currentTarget.style.background = COLORS.navy}
            >Start Booking Now →</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{
                display: "flex", gap: 20, alignItems: "flex-start",
                opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(30px)",
                transition: `all 0.6s ${0.1 + i * 0.12}s`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: COLORS.gold }}>{step.num}</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16, color: COLORS.navy, marginBottom: 6 }}>{step.title}</h4>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section id="testimonials" ref={ref} style={{ background: COLORS.cream, padding: "100px 5vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>Stories</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 44px)", color: COLORS.navy, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s 0.1s" }}>
            Families who trust Care24
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} style={{
              background: COLORS.white, border: `1px solid ${COLORS.border}`,
              borderRadius: 16, padding: "32px 28px",
              opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: `all 0.6s ${i * 0.1}s`,
            }}>
              <StarRating count={t.rating} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: COLORS.text, margin: "18px 0 24px", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${COLORS.border}`, paddingTop: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: COLORS.gold }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: COLORS.navy }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>{t.location} · {t.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} style={{ background: COLORS.navy, padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18, opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>Get Started Today</div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 5vw, 52px)", color: COLORS.white, lineHeight: 1.2, marginBottom: 20, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s 0.1s" }}>
          Your loved one deserves the <em style={{ color: COLORS.gold }}>best care</em>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 40, opacity: inView ? 1 : 0, transition: "opacity 0.6s 0.2s" }}>
          Join thousands of families who've found peace of mind through verified, compassionate in-home care.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", opacity: inView ? 1 : 0, transition: "opacity 0.6s 0.3s" }}>
          <button style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, color: COLORS.navy, border: "none", padding: "15px 36px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(212,168,83,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >Book a Caregiver →</button>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.25)", padding: "15px 28px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, cursor: "pointer" }}>
            Talk to Us
          </button>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 24 }}>No commitment required · Cancel any time</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#080F1E", padding: "60px 5vw 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>❤</div>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: COLORS.white }}>Care<span style={{ color: COLORS.gold }}>24</span></span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 260 }}>
              Connecting families with verified healthcare professionals for compassionate in-home elderly care.
            </p>
          </div>
          {[
            { heading: "Services", links: ["Nursing Care", "Physiotherapy", "Elderly Attendant", "Post-Hospital Care"] },
            { heading: "Company", links: ["About Us", "How It Works", "Careers", "Press"] },
            { heading: "Support", links: ["Help Centre", "Contact Us", "Privacy Policy", "Terms of Service"] },
          ].map(col => (
            <div key={col.heading}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>{col.heading}</h4>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = COLORS.gold}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025 Care24. All rights reserved.</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Made with ❤ in India</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

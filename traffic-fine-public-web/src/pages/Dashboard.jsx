import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const s = styles;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 24px;
          animation: fadeUp 0.5s ease both;
          transition: transform 0.2s, background 0.2s;
        }
        .stat-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.1); }
        .logout-btn {
          padding: 10px 22px;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: transparent;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.3px;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }
      `}</style>

      <div style={s.page}>
        {/* Navbar */}
        <nav style={s.nav}>
          <div style={s.navBrand}>
            <div style={s.navDot} />
            <span style={s.navTitle}>Traffic Fine System</span>
          </div>
          <div style={s.navRight}>
            <span style={s.navUser}>
              👮 {user?.username || "Officer"}
              {user?.role && (
                <span style={s.roleBadge}>{user.role}</span>
              )}
            </span>
            <button id="dashboard-logout-btn" className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </nav>

        {/* Main */}
        <main style={s.main}>
          <h1 style={s.heading}>Welcome back, {user?.username || "Officer"} 👋</h1>
          <p style={s.subtitle}>
            You are now logged into the Traffic Fine Management System.
            Use the modules below to manage fines and records.
          </p>

          {/* Stats row */}
          <div style={s.statsGrid}>
            {[
              { icon: "📋", label: "Total Fines", value: "—" },
              { icon: "✅", label: "Fines Paid", value: "—" },
              { icon: "⏳", label: "Pending Fines", value: "—" },
              { icon: "💰", label: "Revenue (LKR)", value: "—" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="stat-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div style={s.statIcon}>{stat.icon}</div>
                <div style={s.statValue}>{stat.value}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Placeholder notice */}
          <div style={s.notice}>
            <span style={s.noticeIcon}>🚧</span>
            <div>
              <strong>Dashboard under construction.</strong>
              <br />
              Additional modules (fine management, officer records, reports) will be connected here.
            </div>
          </div>

          {/* Quick link to public payment portal */}
          <div
            id="dashboard-payment-portal-link"
            onClick={() => navigate("/")}
            style={s.portalCard}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(22,184,157,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(22,184,157,0.08)"}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>💳</div>
            <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>
              Public Fine Payment Portal
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
              Open the citizen-facing payment page to verify and pay traffic fines online.
            </div>
            <div style={{ marginTop: "12px", fontSize: "13px", color: "#7ef0d8", fontWeight: "700" }}>
              Open Portal →
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #071c36 0%, #0b5b7a 55%, #12b89f 100%)",
    fontFamily: "'Inter', Arial, sans-serif",
    color: "#fff",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 36px",
    height: "64px",
    background: "rgba(7,28,54,0.6)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #16b89d, #087f8c)",
  },
  navTitle: {
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.2px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navUser: {
    fontSize: "13px",
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  roleBadge: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    padding: "3px 9px",
    borderRadius: "999px",
    background: "rgba(22,184,157,0.25)",
    color: "#7ef0d8",
    border: "1px solid rgba(22,184,157,0.35)",
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "48px 24px",
  },
  heading: {
    margin: "0 0 10px",
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.4px",
  },
  subtitle: {
    margin: "0 0 40px",
    fontSize: "15px",
    color: "rgba(255,255,255,0.65)",
    lineHeight: "1.7",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "36px",
  },
  statIcon: {
    fontSize: "28px",
    marginBottom: "12px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "4px",
    color: "#7ef0d8",
  },
  statLabel: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  notice: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    padding: "20px 22px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.75)",
  },
  noticeIcon: {
    fontSize: "22px",
    flexShrink: 0,
    marginTop: "1px",
  },
  portalCard: {
    marginTop: "20px",
    padding: "22px 24px",
    borderRadius: "16px",
    background: "rgba(22,184,157,0.08)",
    border: "1px solid rgba(22,184,157,0.25)",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.2s",
    color: "#fff",
  },
};

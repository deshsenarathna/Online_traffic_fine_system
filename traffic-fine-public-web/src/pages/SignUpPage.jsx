import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../api/registerApi";

function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite", display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16b89d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validate() {
    if (!username.trim()) return "Username is required.";
    if (username.trim().length < 3) return "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))
      return "Username can only contain letters, numbers, and underscores.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await registerRequest(username.trim(), password);
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? "Username is already taken. Please choose another."
          : "Registration failed. Please try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const s = styles;

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .signup-btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 14px;
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #fff;
            background: linear-gradient(90deg, #087f8c 0%, #16b89d 100%);
            cursor: pointer;
            box-shadow: 0 12px 28px rgba(22,184,157,0.28);
            transition: opacity 0.2s, box-shadow 0.2s, transform 0.15s;
            font-family: 'Inter', sans-serif;
          }
          .signup-btn:hover { opacity: 0.93; transform: translateY(-1px); }
        `}</style>
        <div style={s.page}>
          <div style={{ ...s.card, textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <CheckIcon />
            </div>
            <h1 style={{ ...s.heading, fontSize: "24px", marginBottom: "10px" }}>
              Account Created!
            </h1>
            <p style={{ color: "#627d98", fontSize: "15px", marginBottom: "28px", lineHeight: "1.6" }}>
              Your account <strong style={{ color: "#102a43" }}>@{username}</strong> has been
              successfully created. You can now sign in.
            </p>
            <button className="signup-btn" onClick={() => navigate("/login")}>
              Go to Sign In
            </button>
          </div>
          <div style={s.blob1} />
          <div style={s.blob2} />
        </div>
      </>
    );
  }

  // ── Main sign-up form ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-6px); }
          40%,80%  { transform: translateX(6px); }
        }
        .signup-field:focus-within label { color: #16b89d; }
        .signup-input {
          width: 100%;
          padding: 13px 14px;
          border: 1.5px solid #d1dbe6;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          color: #102a43;
          background: #f8fbfd;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .signup-input:focus {
          border-color: #16b89d;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(22,184,157,0.15);
        }
        .signup-input::placeholder { color: #aab8c5; }
        .signup-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #fff;
          background: linear-gradient(90deg, #087f8c 0%, #16b89d 100%);
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(22,184,157,0.28);
          transition: opacity 0.2s, box-shadow 0.2s, transform 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .signup-btn:hover:not(:disabled) {
          opacity: 0.93;
          box-shadow: 0 16px 36px rgba(22,184,157,0.36);
          transform: translateY(-1px);
        }
        .signup-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .error-box { animation: shake 0.4s ease; }
        .strength-bar { height: 4px; border-radius: 4px; transition: width 0.3s, background 0.3s; }
      `}</style>

      <div style={s.page}>
        <div style={s.card}>

          {/* Badge */}
          <div style={s.badge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Create Account
          </div>

          <h1 style={s.heading}>Officer Sign Up</h1>
          <p style={s.subtitle}>Sri Lanka Traffic Fine Management System</p>

          <form onSubmit={handleSubmit} noValidate style={{ marginTop: "28px" }}>

            {/* Username */}
            <div className="signup-field" style={s.fieldWrap}>
              <label style={s.label} htmlFor="su-username">Username</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#829ab1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="su-username"
                  className="signup-input"
                  style={{ paddingLeft: "42px" }}
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  disabled={loading}
                />
              </div>
              <p style={s.hint}>Letters, numbers, and underscores only.</p>
            </div>

            {/* Password */}
            <div className="signup-field" style={s.fieldWrap}>
              <label style={s.label} htmlFor="su-password">Password</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#829ab1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="su-password"
                  className="signup-input"
                  style={{ paddingLeft: "42px", paddingRight: "46px" }}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={s.eyeBtn} tabIndex={-1} aria-label="Toggle password">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {/* Password strength bar */}
              {password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1, 2, 3].map(level => (
                      <div
                        key={level}
                        className="strength-bar"
                        style={{
                          flex: 1,
                          background: passwordStrength(password) >= level
                            ? passwordStrength(password) === 1 ? "#e53e3e"
                              : passwordStrength(password) === 2 ? "#dd6b20"
                              : "#16b89d"
                            : "#e2e8f0"
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ ...s.hint, color: passwordStrength(password) === 1 ? "#e53e3e" : passwordStrength(password) === 2 ? "#dd6b20" : "#16b89d" }}>
                    {["", "Weak", "Fair", "Strong"][passwordStrength(password)]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="signup-field" style={s.fieldWrap}>
              <label style={s.label} htmlFor="su-confirm">Confirm Password</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#829ab1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4" />
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="su-confirm"
                  className="signup-input"
                  style={{
                    paddingLeft: "42px",
                    paddingRight: "46px",
                    borderColor: confirmPassword && password !== confirmPassword ? "#e53e3e" : undefined
                  }}
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={s.eyeBtn} tabIndex={-1} aria-label="Toggle confirm">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p style={{ ...s.hint, color: "#e53e3e" }}>Passwords do not match</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="error-box" style={s.error} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="su-submit"
              type="submit"
              className="signup-btn"
              disabled={loading}
              style={{ marginTop: error ? "16px" : "24px" }}
            >
              {loading ? <><Spinner />&nbsp;&nbsp;Creating account…</> : "Create Account"}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ ...s.footer, marginTop: "20px" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: "#16b89d", fontWeight: "700", cursor: "pointer", fontSize: "13px", fontFamily: "'Inter', sans-serif", padding: 0 }}
            >
              Sign In
            </button>
          </p>

          <p style={s.footer}>🔒 All sessions are encrypted and monitored for security.</p>

          {/* Link to public payment page */}
          <p style={{ ...s.footer, marginTop: "12px" }}>
            Not an officer?{" "}
            <button
              onClick={() => navigate("/")}
              style={{ background: "none", border: "none", color: "#16b89d", fontWeight: "700", cursor: "pointer", fontSize: "11.5px", fontFamily: "'Inter', sans-serif", padding: 0 }}
            >
              Pay a Traffic Fine →
            </button>
          </p>
        </div>

        {/* Decorative blobs */}
        <div style={s.blob1} />
        <div style={s.blob2} />
      </div>
    </>
  );
}

/** Returns 1 (weak), 2 (fair), 3 (strong) */
function passwordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
  if (pwd.length >= 10 && /[^a-zA-Z0-9]/.test(pwd)) score++;
  return Math.max(1, score);
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px 18px",
    background: "linear-gradient(135deg, #071c36 0%, #0b5b7a 45%, #12b89f 100%)",
    fontFamily: "'Inter', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", width: "420px", height: "420px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(22,184,157,0.18) 0%, transparent 70%)",
    top: "-100px", right: "-100px", pointerEvents: "none",
  },
  blob2: {
    position: "absolute", width: "320px", height: "320px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(8,127,140,0.2) 0%, transparent 70%)",
    bottom: "-80px", left: "-60px", pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: "440px",
    backgroundColor: "rgba(255,255,255,0.97)", borderRadius: "24px",
    padding: "40px 38px 32px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
    border: "1px solid rgba(255,255,255,0.4)",
    animation: "fadeUp 0.5s ease both",
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "7px 14px", borderRadius: "999px",
    backgroundColor: "#e8faf7", color: "#08796d",
    fontSize: "12px", fontWeight: "700", letterSpacing: "0.7px",
    textTransform: "uppercase", marginBottom: "18px",
  },
  heading: { margin: "0", color: "#102a43", fontSize: "30px", fontWeight: "800", letterSpacing: "-0.4px", lineHeight: "1.2" },
  subtitle: { margin: "8px 0 0", color: "#627d98", fontSize: "14px", lineHeight: "1.6" },
  fieldWrap: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "7px", color: "#486581", fontSize: "13px", fontWeight: "600", transition: "color 0.2s" },
  inputWrap: { position: "relative" },
  inputIcon: { position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", pointerEvents: "none" },
  eyeBtn: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#829ab1", display: "flex", alignItems: "center", padding: "2px", transition: "color 0.2s" },
  hint: { margin: "5px 0 0", fontSize: "11.5px", color: "#829ab1", lineHeight: "1.4" },
  error: { display: "flex", alignItems: "center", gap: "9px", marginTop: "4px", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#fff5f5", border: "1px solid #fec5c5", color: "#c0392b", fontSize: "13px", fontWeight: "500", lineHeight: "1.5" },
  footer: { textAlign: "center", marginTop: "12px", color: "#829ab1", fontSize: "11.5px", lineHeight: "1.6" },
};

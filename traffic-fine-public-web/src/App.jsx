import { BrowserRouter, Route, Routes } from "react-router-dom";
import PaymentPage from "./pages/PaymentPage";

// ── Your part: login & dashboard ──────────────────────────────────────────────
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
// ─────────────────────────────────────────────────────────────────────────────

function PaymentCancel() {
  return (
    <main>
      <h1>Payment cancelled</h1>
      <p>The fine has not been marked as paid.</p>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Your routes (public) ── */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* ── Friend's routes (public — no sign-in required) ── */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
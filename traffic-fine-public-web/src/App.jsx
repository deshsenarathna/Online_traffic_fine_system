import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

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
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
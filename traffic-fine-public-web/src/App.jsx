import { BrowserRouter, Route, Routes } from "react-router-dom";
import PaymentPage from "./pages/PaymentPage";

function PaymentSuccess() {
  return (
    <main>
      <h1>Payment submitted</h1>
      <p>Your payment result is being confirmed.</p>
    </main>
  );
}

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
      <Routes>
        <Route path="/" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
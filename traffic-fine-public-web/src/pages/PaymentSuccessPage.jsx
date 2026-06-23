import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./PaymentSuccessPage.css";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      setError("No payment reference found. Please contact support.");
      setLoading(false);
      return;
    }

    async function fetchPaymentDetails() {
      try {
        const response = await apiClient.get(`/payments/details/${orderId}`);
        setDetails(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to retrieve payment details."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentDetails();
  }, [orderId]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="receipt-page">
        <div className="receipt-loader">
          <div className="receipt-spinner"></div>
          <p>Retrieving payment information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="receipt-page">
        <div className="receipt-card error-card">
          <div className="error-icon">✗</div>
          <h2>Payment Verification Failed</h2>
          <p className="error-message">{error}</p>
          <Link to="/payment" className="back-btn">
            Return to Payment Portal
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = details.paidDateTime
    ? new Date(details.paidDateTime).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  return (
    <div className="receipt-page">
      <div className="receipt-card no-print">
        <div className="success-banner">
          <div className="success-badge">✓</div>
          <h2>Payment Successful</h2>
          <p>Thank you. Your traffic fine has been settled.</p>
        </div>

        <div className="receipt-actions">
          <button onClick={handlePrint} className="print-btn">
            🖨 Download PDF Receipt
          </button>
          <Link to="/payment" className="portal-link">
            Return to Portal
          </Link>
        </div>
      </div>

      {/* Printable Receipt document layout */}
      <div className="printable-receipt">
        <div className="receipt-header">
          <div className="gov-title">SRI LANKA POLICE DEPARTMENT</div>
          <div className="receipt-title">Official Fine Payment Receipt</div>
        </div>

        <div className="receipt-grid">
          <div className="receipt-section">
            <h3>Transaction Details</h3>
            <div className="receipt-row">
              <span className="row-label">Payment Reference:</span>
              <span className="row-val value-bold">{details.paymentReference}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Transaction ID:</span>
              <span className="row-val">{details.gatewayTransactionId || "N/A"}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Date & Time:</span>
              <span className="row-val">{formattedDate}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Payment Method:</span>
              <span className="row-val">{details.paymentMethod || "CARD"}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Status:</span>
              <span className="row-val status-badge-success">{details.paymentStatus}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h3>Fine & Driver Details</h3>
            <div className="receipt-row">
              <span className="row-label">Fine Reference No:</span>
              <span className="row-val value-bold">{details.fineReferenceNumber}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Violation Category:</span>
              <span className="row-val">{details.fineCategoryName}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Driver Full Name:</span>
              <span className="row-val">{details.driverName}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Driving License No:</span>
              <span className="row-val">{details.driverLicenseNumber}</span>
            </div>
            <div className="receipt-row">
              <span className="row-label">Vehicle Registration:</span>
              <span className="row-val">{details.vehicleNumber}</span>
            </div>
          </div>
        </div>

        <div className="receipt-footer">
          <div className="total-amount">
            <span className="total-label">Total Amount Settled:</span>
            <span className="total-val">LKR {details.amount.toFixed(2)}</span>
          </div>

          <p className="legal-disclaimer">
            This is a computer-generated official receipt. No signature is required.
            The fine has been updated as **PAID** in the national database.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;

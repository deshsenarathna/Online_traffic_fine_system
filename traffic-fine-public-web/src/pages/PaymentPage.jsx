import { useState } from "react";
import apiClient from "../api/apiClient";
import FineForm from "../components/Fineform";
import FineSummary from "../components/FineSummary";

function PaymentPage() {
  const [fine, setFine] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);

  async function initiatePayment() {
    setLoading(true);
    setPaymentError("");

    try {
      const response = await apiClient.post("/payments/initiate", {
        referenceNumber: fine.referenceNumber,
        paymentMethod: "CARD",
      });

      const paymentData = response.data;

      submitToPaymentGateway(
        paymentData.checkoutUrl,
        paymentData.payHereParams
      );
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to initiate payment.";

      setPaymentError(message);
    } finally {
      setLoading(false);
    }
  }

  function submitToPaymentGateway(checkoutUrl, paymentParameters) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = checkoutUrl;

    Object.entries(paymentParameters).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <main>
      {!fine ? (
        <FineForm onFineCreated={setFine} />
      ) : (
        <>
          <FineSummary
            fine={fine}
            onPay={initiatePayment}
            loading={loading}
          />

          {paymentError && <p>{paymentError}</p>}

          <button type="button" onClick={() => setFine(null)}>
            Edit details
          </button>
        </>
      )}
    </main>
  );
}

export default PaymentPage;
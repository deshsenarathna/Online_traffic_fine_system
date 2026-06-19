package com.ruhuna.traffic_fine_backend.service;


import com.ruhuna.traffic_fine_backend.Entity.Fine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PayHerePaymentGatewayService {

    @Value("${payhere.merchant-id}")
    private String merchantId;

    @Value("${payhere.merchant-secret}")
    private String merchantSecret;

    @Value("${payhere.currency}")
    private String currency;

    @Value("${payhere.checkout-url}")
    private String checkoutUrl;

    @Value("${payhere.return-url}")
    private String returnUrl;

    @Value("${payhere.cancel-url}")
    private String cancelUrl;

    @Value("${payhere.notify-url}")
    private String notifyUrl;

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public Map<String, String> buildPaymentParams(Fine fine, String paymentReference) {
        String amountFormatted = formatAmount(fine.getAmount());
        String hash = generateCheckoutHash(paymentReference, amountFormatted);

        Map<String, String> params = new LinkedHashMap<>();
        params.put("merchant_id", merchantId);
        params.put("return_url", returnUrl);
        params.put("cancel_url", cancelUrl);
        params.put("notify_url", notifyUrl);

        params.put("order_id", paymentReference);
        params.put("items", "Traffic Fine Payment - " + fine.getReferenceNumber());
        params.put("currency", currency);
        params.put("amount", amountFormatted);
        params.put("hash", hash);

        params.put("first_name", fine.getDriverName());
        params.put("last_name", "Driver");
        params.put("email", "driver@example.com");
        params.put("phone", "0771234567");
        params.put("address", "N/A");
        params.put("city", fine.getDistrict().getDistrictName());
        params.put("country", "Sri Lanka");

        params.put("custom_1", fine.getReferenceNumber());
        params.put("custom_2", fine.getVehicleNumber());

        return params;
    }

    public boolean verifyNotification(String merchantIdFromNotify,
                                      String orderId,
                                      String payhereAmount,
                                      String payhereCurrency,
                                      String statusCode,
                                      String md5sig) {
        String localMd5sig = md5(
                merchantIdFromNotify
                        + orderId
                        + payhereAmount
                        + payhereCurrency
                        + statusCode
                        + md5(merchantSecret)
        );

        return localMd5sig.equalsIgnoreCase(md5sig);
    }

    private String generateCheckoutHash(String orderId, String amountFormatted) {
        return md5(
                merchantId
                        + orderId
                        + amountFormatted
                        + currency
                        + md5(merchantSecret)
        );
    }

    private String formatAmount(Double amount) {
        return BigDecimal.valueOf(amount)
                .setScale(2)
                .toPlainString();
    }

    private String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();

            for (byte b : digest) {
                hexString.append(String.format("%02x", b));
            }

            return hexString.toString().toUpperCase();
        } catch (Exception e) {
            throw new RuntimeException("Error generating MD5 hash", e);
        }
    }
}

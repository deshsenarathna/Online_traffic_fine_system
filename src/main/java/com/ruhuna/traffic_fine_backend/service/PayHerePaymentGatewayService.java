package com.ruhuna.traffic_fine_backend.service;

import com.ruhuna.traffic_fine_backend.Entity.Fine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
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
        return checkoutUrl.trim();
    }

    public Map<String, String> buildPaymentParams(
            Fine fine,
            String paymentReference
    ) {
        String cleanMerchantId = merchantId.trim();
        String cleanMerchantSecret = merchantSecret.trim();
        String cleanCurrency = currency.trim();

        String cleanOrderId = paymentReference.trim();
        String amountFormatted = formatAmount(fine.getAmount());

        String hash = generateCheckoutHash(
                cleanMerchantId,
                cleanMerchantSecret,
                cleanOrderId,
                amountFormatted,
                cleanCurrency
        );

        // Temporary safe debugging. Do not print the merchant secret.
        System.out.println("=== PAYHERE REQUEST DEBUG ===");
        System.out.println("Merchant ID: [" + cleanMerchantId + "]");
        System.out.println("Order ID: [" + cleanOrderId + "]");
        System.out.println("Amount: [" + amountFormatted + "]");
        System.out.println("Currency: [" + cleanCurrency + "]");
        System.out.println("Hash: [" + hash + "]");
        System.out.println("=============================");

        Map<String, String> params = new LinkedHashMap<>();

        params.put("merchant_id", cleanMerchantId);
        params.put("return_url", returnUrl.trim());
        params.put("cancel_url", cancelUrl.trim());
        params.put("notify_url", notifyUrl.trim());

        params.put("order_id", cleanOrderId);
        params.put(
                "items",
                "Traffic Fine Payment - " + fine.getReferenceNumber()
        );
        params.put("currency", cleanCurrency);
        params.put("amount", amountFormatted);
        params.put("hash", hash);

        params.put("first_name", safeValue(fine.getDriverName(), "Driver"));
        params.put("last_name", "Customer");
        params.put("email", "driver@example.com");
        params.put("phone", "0771234567");
        params.put("address", "Sri Lanka");

        String city = "Colombo";

        if (fine.getDistrict() != null
                && fine.getDistrict().getDistrictName() != null) {
            city = fine.getDistrict().getDistrictName();
        }

        params.put("city", city);
        params.put("country", "Sri Lanka");

        params.put("custom_1", fine.getReferenceNumber());
        params.put("custom_2", safeValue(fine.getVehicleNumber(), ""));

        return params;
    }

    public boolean verifyNotification(
            String merchantIdFromNotify,
            String orderId,
            String payhereAmount,
            String payhereCurrency,
            String statusCode,
            String md5sig
    ) {
        String cleanSecret = merchantSecret.trim();

        String localMd5sig = md5(
                merchantIdFromNotify.trim()
                        + orderId.trim()
                        + payhereAmount.trim()
                        + payhereCurrency.trim()
                        + statusCode.trim()
                        + md5(cleanSecret)
        );

        return localMd5sig.equalsIgnoreCase(md5sig.trim());
    }

    private String generateCheckoutHash(
            String cleanMerchantId,
            String cleanMerchantSecret,
            String orderId,
            String amountFormatted,
            String cleanCurrency
    ) {
        String hashedMerchantSecret = md5(cleanMerchantSecret);

        String hashInput =
                cleanMerchantId
                        + orderId
                        + amountFormatted
                        + cleanCurrency
                        + hashedMerchantSecret;

        return md5(hashInput);
    }

    private String formatAmount(Double amount) {
        if (amount == null) {
            throw new IllegalArgumentException("Payment amount cannot be null");
        }

        return BigDecimal.valueOf(amount)
                .setScale(2)
                .toPlainString();
    }

    private String safeValue(String value, String fallback) {
        return value == null || value.isBlank()
                ? fallback
                : value.trim();
    }

    private String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");

            byte[] digest = md.digest(
                    input.getBytes(StandardCharsets.UTF_8)
            );

            StringBuilder hexString = new StringBuilder();

            for (byte value : digest) {
                hexString.append(String.format("%02X", value));
            }

            return hexString.toString();
        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Error generating PayHere MD5 hash",
                    exception
            );
        }
    }
}
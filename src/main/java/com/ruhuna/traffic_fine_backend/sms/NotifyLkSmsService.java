package com.ruhuna.traffic_fine_backend.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/**
 * Sends SMS through the Notify.lk gateway.
 * <p>
 * Active only when {@code sms.provider=notifylk}. Reads credentials from
 * {@code sms.notifylk.*} config. Like every {@link SmsService}, it never throws:
 * any error is logged and reported as {@code false}.
 *
 * @see <a href="https://developer.notify.lk/api-endpoints/">Notify.lk API docs</a>
 */
@Service
@ConditionalOnProperty(name = "sms.provider", havingValue = "notifylk")
public class NotifyLkSmsService implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(NotifyLkSmsService.class);

    private static final String SEND_ENDPOINT = "https://app.notify.lk/api/v1/send";

    @Value("${sms.notifylk.user-id}")
    private String userId;

    @Value("${sms.notifylk.api-key}")
    private String apiKey;

    @Value("${sms.notifylk.sender-id}")
    private String senderId;

    private final RestClient restClient = RestClient.create();

    @Override
    public boolean sendSms(String toPhoneNumber, String message) {
        String to = PhoneNumberFormatter.toNotifyLkFormat(toPhoneNumber);
        if (to == null) {
            log.warn("[NotifyLk] Cannot send SMS: recipient phone number is empty/invalid (raw: {})",
                    toPhoneNumber);
            return false;
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("user_id", userId);
        form.add("api_key", apiKey);
        form.add("sender_id", senderId);
        form.add("to", to);
        form.add("message", message);

        try {
            String response = restClient.post()
                    .uri(SEND_ENDPOINT)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(String.class);

            // Notify.lk returns JSON like {"status":"success",...} on success.
            boolean ok = response != null && response.toLowerCase().contains("\"status\":\"success\"");
            if (ok) {
                log.info("[NotifyLk] SMS sent to {}", to);
            } else {
                log.warn("[NotifyLk] SMS to {} not accepted. Gateway response: {}", to, response);
            }
            return ok;
        } catch (Exception e) {
            log.error("[NotifyLk] Failed to send SMS to {}: {}", to, e.getMessage());
            return false;
        }
    }
}

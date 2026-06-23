package com.ruhuna.traffic_fine_backend.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * Default {@link SmsService}, used when no real SMS provider is configured.
 * <p>
 * It contacts no external gateway; it just logs the message, so the whole
 * application (and the payment flow) runs end-to-end with NO API keys.
 * Active when {@code sms.provider} is missing or set to {@code mock}.
 */
@Service
@ConditionalOnProperty(name = "sms.provider", havingValue = "mock", matchIfMissing = true)
public class MockSmsService implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(MockSmsService.class);

    @Override
    public boolean sendSms(String toPhoneNumber, String message) {
        String formatted = PhoneNumberFormatter.toNotifyLkFormat(toPhoneNumber);
        log.info("[MOCK SMS] No real SMS provider configured (sms.provider=mock). "
                + "Would send to {} (raw: {}): \"{}\"", formatted, toPhoneNumber, message);
        return true;
    }
}

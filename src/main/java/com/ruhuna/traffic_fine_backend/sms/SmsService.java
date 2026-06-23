package com.ruhuna.traffic_fine_backend.sms;

/**
 * Abstraction for sending an SMS.
 * <p>
 * Implementations must NEVER throw. They return a boolean so the caller
 * (e.g. payment confirmation) is never affected by an SMS gateway outage or
 * bad configuration.
 */
public interface SmsService {

    /**
     * Sends an SMS.
     *
     * @param toPhoneNumber recipient phone number in any local format; the
     *                      implementation normalises it to the gateway format
     * @param message       the message body
     * @return {@code true} if the gateway accepted the message, {@code false} otherwise
     */
    boolean sendSms(String toPhoneNumber, String message);
}

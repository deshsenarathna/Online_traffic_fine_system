package com.ruhuna.traffic_fine_backend.sms;

/**
 * Converts Sri Lankan phone numbers into the format Notify.lk expects:
 * {@code 94XXXXXXXXX} (country code 94, no leading 0, no '+').
 */
public final class PhoneNumberFormatter {

    private PhoneNumberFormatter() {
    }

    /**
     * Normalises common Sri Lankan number formats to {@code 94XXXXXXXXX}.
     * <pre>
     *   0771234567   -> 94771234567
     *   +94771234567 -> 94771234567
     *   94771234567  -> 94771234567
     *   771234567    -> 94771234567
     * </pre>
     *
     * @return the normalised number, or {@code null} if the input has no digits
     */
    public static String toNotifyLkFormat(String raw) {
        if (raw == null) {
            return null;
        }

        // Strip everything except digits (removes '+', spaces, dashes).
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) {
            return null;
        }

        if (digits.startsWith("94")) {
            return digits;
        }
        if (digits.startsWith("0")) {
            return "94" + digits.substring(1);
        }
        // Bare subscriber number (e.g. 771234567).
        return "94" + digits;
    }
}

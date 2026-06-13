package com.ruhuna.traffic_fine_backend.exception;

/**
 * Thrown for invalid client input (e.g. unknown fine category code, invalid
 * officer badge number, bad gateway signature).
 * Mapped to HTTP 400 by {@link GlobalExceptionHandler}.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}

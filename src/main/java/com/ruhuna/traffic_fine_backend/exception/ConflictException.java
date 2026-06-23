package com.ruhuna.traffic_fine_backend.exception;

/**
 * Thrown when a request conflicts with the current state of a resource
 * (e.g. fine already paid, duplicate reference number).
 * Mapped to HTTP 409 by {@link GlobalExceptionHandler}.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}

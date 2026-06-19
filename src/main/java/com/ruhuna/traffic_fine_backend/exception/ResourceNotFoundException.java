package com.ruhuna.traffic_fine_backend.exception;

/**
 * Thrown when a requested entity (fine, payment, ...) does not exist.
 * Mapped to HTTP 404 by {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

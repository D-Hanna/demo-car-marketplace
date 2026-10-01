package com.marketplace.car.exception;

/**
 * Exception thrown when a requested car resource is not found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

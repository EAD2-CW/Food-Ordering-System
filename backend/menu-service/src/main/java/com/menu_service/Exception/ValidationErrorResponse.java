package com.menu_service.Exception;

public class ValidationErrorResponse extends RuntimeException {
    public ValidationErrorResponse(String message) {
        super(message);
    }
}

package com.menu_service.Exception;

public class CategoryAlreadyExsistsException extends RuntimeException {
    public CategoryAlreadyExsistsException(String message) {
        super(message);
    }
}

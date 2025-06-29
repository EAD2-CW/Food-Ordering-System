package com.menu_service.Exception;

public class MenuItemAlreadyExsistsException extends RuntimeException {
    public MenuItemAlreadyExsistsException(String message) {
        super(message);
    }
}

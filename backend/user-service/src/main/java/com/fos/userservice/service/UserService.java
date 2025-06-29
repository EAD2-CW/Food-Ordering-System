package com.fos.userservice.service;

import com.fos.userservice.dto.UserRegistrationDTO;
import com.fos.userservice.dto.LoginRequestDTO;
import com.fos.userservice.dto.UserResponseDTO;

import java.util.List;

public interface UserService {

    // User registration
    UserResponseDTO registerUser(UserRegistrationDTO registrationDTO);

    // User authentication
    UserResponseDTO authenticateUser(LoginRequestDTO loginRequest);

    // Get user by ID
    UserResponseDTO getUserById(Long userId);

    // Get user by email
    UserResponseDTO getUserByEmail(String email);

    // Get all users (for admin)
    List<UserResponseDTO> getAllUsers();

    // Update user profile
    UserResponseDTO updateUser(Long userId, UserRegistrationDTO updateDTO);

    // Delete user (for admin)
    void deleteUser(Long userId);

    // Check if email exists
    boolean emailExists(String email);
}
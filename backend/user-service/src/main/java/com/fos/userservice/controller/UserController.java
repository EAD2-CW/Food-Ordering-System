package com.fos.userservice.controller;

import com.fos.userservice.dto.ApiResponse;
import com.fos.userservice.dto.UserRegistrationDTO;
import com.fos.userservice.dto.LoginRequestDTO;
import com.fos.userservice.dto.UserResponseDTO;
import com.fos.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class UserController {

    @Autowired
    private UserService userService;

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("User Service is running!", "Service is healthy")
        );
    }

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> registerUser(
            @Valid @RequestBody UserRegistrationDTO registrationDTO) {
        try {
            UserResponseDTO user = userService.registerUser(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.success(user, "User registered successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.error(e.getMessage(), "Registration failed")
            );
        }
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponseDTO>> loginUser(
            @Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            UserResponseDTO user = userService.authenticateUser(loginRequest);
            return ResponseEntity.ok(
                    ApiResponse.success(user, "Login successful")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ApiResponse.error(e.getMessage(), "Login failed")
            );
        }
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
        try {
            UserResponseDTO user = userService.getUserById(id);
            return ResponseEntity.ok(
                    ApiResponse.success(user, "User retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error(e.getMessage(), "User not found")
            );
        }
    }

    // Get User by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserByEmail(@PathVariable String email) {
        try {
            UserResponseDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(
                    ApiResponse.success(user, "User retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error(e.getMessage(), "User not found")
            );
        }
    }

    // Get All Users (Admin functionality)
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {
        try {
            List<UserResponseDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(
                    ApiResponse.success(users, "Users retrieved successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(e.getMessage(), "Failed to retrieve users")
            );
        }
    }

    // Update User Profile
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRegistrationDTO updateDTO) {
        try {
            UserResponseDTO updatedUser = userService.updateUser(id, updateDTO);
            return ResponseEntity.ok(
                    ApiResponse.success(updatedUser, "User updated successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.error(e.getMessage(), "User update failed")
            );
        }
    }

    // Delete User (Admin functionality)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(
                    ApiResponse.success("User deleted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error(e.getMessage(), "User deletion failed")
            );
        }
    }

    // Check if email exists
    @GetMapping("/check-email/{email}")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailExists(@PathVariable String email) {
        try {
            boolean exists = userService.emailExists(email);
            return ResponseEntity.ok(
                    ApiResponse.success(exists, "Email check completed")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error(e.getMessage(), "Email check failed")
            );
        }
    }

    // Get users by role
//    @GetMapping("/role/{role}")
//    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getUsersByRole(@PathVariable String role) {
//        try {
//            List<UserResponseDTO> users = userService.getUsersByRole(role);
//            return ResponseEntity.ok(
//                    ApiResponse.success(users, "Users by role retrieved successfully")
//            );
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    ApiResponse.error(e.getMessage(), "Failed to retrieve users by role")
//            );
//        }
//    }

    // Preflight request handler
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok().build();
    }
}
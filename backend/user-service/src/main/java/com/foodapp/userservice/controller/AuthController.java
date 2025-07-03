package com.foodapp.userservice.controller;

import com.foodapp.userservice.dto.LoginRequest;
import com.foodapp.userservice.dto.LoginResponse;
import com.foodapp.userservice.dto.ErrorResponse;
import com.foodapp.userservice.model.User;
import com.foodapp.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticateUser(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            // For simplicity, we'll use a basic token (you can implement JWT later)
            String token = "simple_token_" + user.getId() + "_" + System.currentTimeMillis();

            LoginResponse response = new LoginResponse(token, user);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User createdUser = userService.registerUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}
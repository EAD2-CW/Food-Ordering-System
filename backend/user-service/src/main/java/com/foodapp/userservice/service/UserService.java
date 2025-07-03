package com.foodapp.userservice.service;

import com.foodapp.userservice.model.User;
import com.foodapp.userservice.model.Role;
import com.foodapp.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(Role.CUSTOMER);
        }

        return userRepository.save(user);
    }

    public User authenticateUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple password check (in production, use BCrypt or similar)
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        throw new RuntimeException("Invalid credentials");
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        if (userDetails.getUsername() != null && !userDetails.getUsername().trim().isEmpty()) {
            user.setUsername(userDetails.getUsername());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().trim().isEmpty()) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPhone() != null) {
            user.setPhone(userDetails.getPhone());
        }
        if (userDetails.getAddress() != null) {
            user.setAddress(userDetails.getAddress());
        }

        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
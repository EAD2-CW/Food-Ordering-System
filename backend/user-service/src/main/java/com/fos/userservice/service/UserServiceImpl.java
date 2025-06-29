package com.fos.userservice.service;

import com.fos.userservice.dto.UserRegistrationDTO;
import com.fos.userservice.dto.LoginRequestDTO;
import com.fos.userservice.dto.UserResponseDTO;
import com.fos.userservice.exception.UserAlreadyExistsException;
import com.fos.userservice.exception.InvalidCredentialsException;
import com.fos.userservice.exception.UserNotFoundException;
import com.fos.userservice.model.User;
import com.fos.userservice.repository.UserRepository;
import com.fos.userservice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements com.fos.userservice.service.UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserResponseDTO registerUser(UserRegistrationDTO registrationDTO) {
        // Check if email already exists
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered: " + registrationDTO.getEmail());
        }

        // Create new user
        User user = new User();
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(registrationDTO.getPassword()); // In production, encode this password
        user.setFirstName(registrationDTO.getFirstName());
        user.setLastName(registrationDTO.getLastName());
        user.setPhoneNumber(registrationDTO.getPhoneNumber());
        user.setAddress(registrationDTO.getAddress());

        // Save user
        User savedUser = userRepository.save(user);

        return mapToUserResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO authenticateUser(LoginRequestDTO loginRequest) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Check password (in production, use password encoder)
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return mapToUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        return mapToUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        return mapToUserResponseDTO(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToUserResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO updateUser(Long userId, UserRegistrationDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        // Update fields
        user.setFirstName(updateDTO.getFirstName());
        user.setLastName(updateDTO.getLastName());
        user.setPhoneNumber(updateDTO.getPhoneNumber());
        user.setAddress(updateDTO.getAddress());

        // Check if email is being changed and if new email already exists
        if (!user.getEmail().equals(updateDTO.getEmail())) {
            if (userRepository.existsByEmail(updateDTO.getEmail())) {
                throw new UserAlreadyExistsException("Email already registered: " + updateDTO.getEmail());
            }
            user.setEmail(updateDTO.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponseDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // Helper method to map User entity to UserResponseDTO
    private UserResponseDTO mapToUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getRole().toString()
        );
    }
}
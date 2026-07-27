package com.example.expensetracker.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.expensetracker.dto.UpdateProfileRequest;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.entity.PasswordResetToken;
import com.example.expensetracker.repository.PasswordResetTokenRepository;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {
    @Autowired 
    private UserRepository ur;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers()
    {
        return ur.findAll();
    }

    public User addUser(User user) 
    {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ur.save(user);
    }

    public User getUserByEmail(String email, String password) 
    {
        User user = ur.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    
        if (!passwordEncoder.matches(password, user.getPassword())) 
        {
            throw new RuntimeException("Invalid password");
        }
        return user;
    }

    public User updateProfile(int userId, UpdateProfileRequest request) 
    {
        User user = ur.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        return ur.save(user);
    }

    public User getUserById(int id) 
    {
        return ur.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void forgotPassword(String email) 
    {
        User user = ur.getUserByEmail(email)
            .orElseThrow(() -> new RuntimeException("No account found with this email"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(email, resetLink);
    }

    public void resetPassword(String token, String newPassword) 
    {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Reset link already used");
        }

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset link has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        ur.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    public void changePassword(int userId, String currentPassword, String newPassword) {
        User user = ur.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        ur.save(user);
    }
}

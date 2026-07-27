package com.example.expensetracker.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.dto.AuthResponse;
import com.example.expensetracker.dto.ChangePasswordRequest;
import com.example.expensetracker.dto.ForgotPasswordRequest;
import com.example.expensetracker.dto.LoginRequest;
import com.example.expensetracker.dto.ResetPasswordRequest;
import com.example.expensetracker.dto.UpdateProfileRequest;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.service.UserService;
import com.example.expensetracker.util.JwtUtil;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;






@RestController
public class UserController {
    @Autowired 
    private UserService us;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return us.getAllUsers();
    }

    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
        
        return us.addUser(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        User user = us.getUserByEmail(loginRequest.getEmail(), loginRequest.getPassword());
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    @GetMapping("/getUser/{id}")
    public User getUser(@PathVariable int id) {
        return us.getUserById(id);
    }

    @PutMapping("/updateProfile/{id}")
    public User updateProfile(@PathVariable int id, @RequestBody UpdateProfileRequest request) {
        return us.updateProfile(id, request);
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            us.forgotPassword(request.getEmail());
            return ResponseEntity.ok("Reset link sent to your email");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            us.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<String> changePassword(@PathVariable int id, @RequestBody ChangePasswordRequest request) {
        try {
            us.changePassword(id, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

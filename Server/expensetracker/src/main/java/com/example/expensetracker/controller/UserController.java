package com.example.expensetracker.controller;

import com.example.expensetracker.dto.AuthResponse;
import com.example.expensetracker.dto.ChangePasswordRequest;
import com.example.expensetracker.dto.ForgotPasswordRequest;
import com.example.expensetracker.dto.LoginRequest;
import com.example.expensetracker.dto.ResetPasswordRequest;
import com.example.expensetracker.dto.UpdateProfileRequest;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.service.UserService;
import com.example.expensetracker.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class UserController {
    @Autowired 
    private UserService us;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/addUser")
    public User addUser(@Valid @RequestBody User user) {
        
        return us.addUser(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        User user = us.getUserByEmail(loginRequest.getEmail(), loginRequest.getPassword());
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getPlan().toString());
    }

    @GetMapping("/getUser/{id}")
    public User getUser(@PathVariable int id) {
        return us.getUserById(id);
    }

    @PutMapping("/updateProfile/{id}")
    public User updateProfile(@PathVariable int id,@Valid @RequestBody UpdateProfileRequest request) {
        return us.updateProfile(id, request);
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        us.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Reset link sent to your email");
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        us.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successful");
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<String> changePassword(@PathVariable int id, @RequestBody ChangePasswordRequest request) {
        us.changePassword(id, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

}

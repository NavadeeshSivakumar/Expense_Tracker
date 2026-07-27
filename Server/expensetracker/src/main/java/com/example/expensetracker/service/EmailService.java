package com.example.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Sorted — Reset your password");
        message.setText(
            "Hi,\n\n" +
            "You requested to reset your password for your Sorted account.\n\n" +
            "Click the link below to reset it:\n" +
            resetLink + "\n\n" +
            "This link expires in 15 minutes.\n\n" +
            "If you didn't request this, ignore this email.\n\n" +
            "— The Sorted Team"
        );
        mailSender.send(message);
    }
}
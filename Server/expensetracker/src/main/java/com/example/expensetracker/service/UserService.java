package com.example.expensetracker.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.repository.UserRepository;

@Service
public class UserService {
    @Autowired 
    private UserRepository ur;

    public List<User> getAllUsers()
    {
        return ur.findAll();
    }

    public Optional<User> getUserById(int id)
    {
        return ur.findById(id);
    }

    public User addUser(User user)
    {
        return ur.save(user);
    }

    public User getUserByEmail(String email, String password)
    {
        Optional<User> tempt = ur.getUserByEmail(email);
        User user = tempt.get();
        return user;
    }
}

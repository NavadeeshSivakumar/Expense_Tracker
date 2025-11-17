package com.example.expensetracker.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.service.UserService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;





@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {
    @Autowired 
    private UserService us;

    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return us.getAllUsers();
    }

    @GetMapping("/getUserById/{id}")
    public Optional<User> getUserById(@PathVariable int id) {
        return us.getUserById(id);
    }

    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
        
        return us.addUser(user);
    }

    @GetMapping("/getUserByEmail")
    public User getUserByEmail(@RequestParam String email, @RequestParam String password) {
        return us.getUserByEmail(email, password);
    }
    

}

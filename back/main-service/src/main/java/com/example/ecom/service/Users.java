package com.example.ecom.service;

import com.example.ecom.model.Userm;
import com.example.ecom.repository.Userr;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Users {

    private final Userr userRepository;

    public Users(Userr userRepository) {
        this.userRepository = userRepository;
    }

    // ------------------------ Register new user ------------------------
    public String registerUser(Userm user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "❌ Email already exists!";
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            return "❌ Username already exists!";
        }
        userRepository.save(user);
        return "✅ User registered successfully!";
    }

    // ------------------------ Authenticate ------------------------
    public boolean authenticate(String email, String password) {
        Userm user = userRepository.findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }

    // ------------------------ Find by email ------------------------
    public Userm findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ------------------------ Get all users ------------------------
    public List<Userm> getAllUsers() {
        return userRepository.findAll();
    }

    // ------------------------ Update user ------------------------
    public Userm updateUser(String email, Userm updated) {
        Userm user = userRepository.findByEmail(email);
        if (user != null) {
            user.setUsername(updated.getUsername());
            user.setRole(updated.getRole());
            user.setPhoneNumber(updated.getPhoneNumber());
            user.setAddress(updated.getAddress());
            user.setActive(updated.isActive());
            // Optional password update
            if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
                user.setPassword(updated.getPassword());
            }
            return userRepository.save(user);
        }
        return null;
    }

    // ------------------------ Delete user ------------------------
    public boolean deleteUser(String email) {
        Userm user = userRepository.findByEmail(email);
        if (user != null) {
            userRepository.delete(user);
            return true;
        }
        return false;
    }
}
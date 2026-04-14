package com.example.ecom.controler;

import com.example.ecom.model.Userm;
import com.example.ecom.service.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class Userc {

    @Autowired
    private Users userService;

    // ✅ Register a new user
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Userm user) {
        String result = userService.registerUser(user);
        return ResponseEntity.ok(result);
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Userm user) {
        Userm u = userService.findByEmail(user.getEmail());
        if (u != null && userService.authenticate(user.getEmail(), user.getPassword())) {
            return ResponseEntity.ok(u); // return full user
        }
        return ResponseEntity.badRequest().body("❌ Invalid email or password!");
    }

    // ✅ Get a single user by email
    @GetMapping("/profile/{email}")
    public ResponseEntity<Userm> getUser(@PathVariable String email) {
        Userm u = userService.findByEmail(email);
        if (u == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(u);
    }

    // ✅ Get all users
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Update a user (admin)
    @PutMapping("/{email}")
    public ResponseEntity<?> updateUser(@PathVariable String email, @RequestBody Userm user) {
        Userm updated = userService.updateUser(email, user);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    // ✅ Delete a user (admin)
    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        if (userService.deleteUser(email)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
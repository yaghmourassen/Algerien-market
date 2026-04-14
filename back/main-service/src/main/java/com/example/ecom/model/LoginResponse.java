package com.example.ecom.model;

public class LoginResponse {
    private final String name;
    private final String role;
    private final String email;
    private final String id;

    public LoginResponse(String name, String role, String email, String id) {
        this.name = name;
        this.role = role;
        this.email = email;
        this.id = id;
    }

    // Getters
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public String getId() { return id; }
}

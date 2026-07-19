package com.yashwanth.pms.user.dto;

import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;

import java.util.UUID;

public class UserResponse {

    private UUID id;
    private String name;
    private String email;
    private Role role;

    public static UserResponse from(User user) {
        if (user == null) return null;
        UserResponse response = new UserResponse();
        response.id = user.getId();
        response.name = user.getName();
        response.email = user.getEmail();
        response.role = user.getRole();
        return response;
    }

    // ❌ REMOVE this method - it's not needed
    // public static UserResponse fromCurrentUser(UUID userId) { ... }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
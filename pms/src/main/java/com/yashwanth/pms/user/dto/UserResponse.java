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
        UserResponse response = new UserResponse();
        response.id = user.getId();
        response.name = user.getName();
        response.email = user.getEmail();
        response.role = user.getRole();
        return response;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}

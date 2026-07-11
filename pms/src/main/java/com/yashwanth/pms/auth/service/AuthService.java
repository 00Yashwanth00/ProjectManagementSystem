package com.yashwanth.pms.auth.service;

import com.yashwanth.pms.auth.dto.RegisterRequest;

public interface AuthService {


    // ✅ New method for ADMIN to create users
    void createUserByAdmin(String name, String email, String password);
}
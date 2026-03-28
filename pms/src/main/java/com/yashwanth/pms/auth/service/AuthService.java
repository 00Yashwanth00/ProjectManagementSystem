package com.yashwanth.pms.auth.service;

import com.yashwanth.pms.auth.dto.RegisterRequest;

public interface AuthService {

    public void createUser(RegisterRequest request);

}

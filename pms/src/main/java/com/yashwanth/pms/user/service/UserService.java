package com.yashwanth.pms.user.service;

import com.yashwanth.pms.user.domain.User;

import java.util.UUID;

public interface UserService {
    User getById(UUID uuid);
}

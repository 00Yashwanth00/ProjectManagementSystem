package com.yashwanth.pms.user.service;

import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getById(UUID uuid);

    List<User> getAllUsers();

    List<User> getUsersByRole(Role role);
}

package com.yashwanth.pms.user.service;

import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.repository.UserRepository;

import java.util.UUID;

public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getById(UUID userId) {

        return userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User not found"));
    }
}

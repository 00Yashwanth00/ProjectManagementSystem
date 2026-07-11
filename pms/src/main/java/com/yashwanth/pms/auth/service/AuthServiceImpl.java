package com.yashwanth.pms.auth.service;

import com.yashwanth.pms.auth.dto.RegisterRequest;
import com.yashwanth.pms.auth.repository.AuthRepository;
import com.yashwanth.pms.common.exception.BusinessException;
import com.yashwanth.pms.common.exception.DuplicateUserException;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    public AuthServiceImpl(AuthRepository repository) {
        this.repository = repository;
    }


    @Override
    public void createUserByAdmin(String name, String email, String password) {
        Optional<User> dup = repository.findByEmail(email);

        if (dup.isPresent()) {
            throw new DuplicateUserException("User already exists with email: " + email);
        }

        User user = new User(
                name,
                email,
                encoder.encode(password),
                Role.EMPLOYEE
        );

        repository.save(user);
    }
}
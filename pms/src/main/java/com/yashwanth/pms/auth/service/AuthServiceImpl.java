package com.yashwanth.pms.auth.service;

import com.yashwanth.pms.auth.dto.RegisterRequest;
import com.yashwanth.pms.auth.repository.AuthRepository;
import com.yashwanth.pms.common.exception.BusinessException;
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
    public void createUser(RegisterRequest request) {

        Optional<User> dup = repository.findByEmail(request.getEmail());

        if(dup.isPresent()) {
            throw new BusinessException("User already exists");
        }

        User user = new User(request.getName(), request.getEmail(), encoder.encode(request.getPassword()), Role.valueOf(request.getRole()));

        repository.save(user);
    }
}

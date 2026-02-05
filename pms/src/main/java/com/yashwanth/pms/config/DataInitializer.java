package com.yashwanth.pms.config;

import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() > 0) return ;

        userRepository.save(
                new User("Admin", "admin@test.com",
                        passwordEncoder.encode("admin123"),
                        Role.ADMIN)
        );

        userRepository.save(
                new User("Leader", "leader@test.com",
                        passwordEncoder.encode("leader123"),
                        Role.PROJECT_LEADER)
        );

        userRepository.save(
                new User("Member", "member@test.com",
                        passwordEncoder.encode("member123"),
                        Role.TEAM_MEMBER)
        );
    }
}

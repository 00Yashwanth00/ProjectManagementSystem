package com.yashwanth.pms.user.repository;

import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);
}

package com.yashwanth.pms.auth.repository;

import com.yashwanth.pms.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AuthRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

}

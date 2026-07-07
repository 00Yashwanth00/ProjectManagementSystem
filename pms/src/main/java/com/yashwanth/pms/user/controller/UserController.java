package com.yashwanth.pms.user.controller;

import com.yashwanth.pms.security.UserPrincipal;
import com.yashwanth.pms.user.domain.Role;
import com.yashwanth.pms.user.domain.User;
import com.yashwanth.pms.user.dto.UserResponse;
import com.yashwanth.pms.user.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/by-role")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsersByRole(@RequestParam Role role) {
        return userService.getUsersByRole(role)
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        UserPrincipal principal =
                (UserPrincipal) authentication.getPrincipal();

        return UserResponse.from(
                userService.getById(principal.getId())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEADER')")
    public UserResponse getUserById(@PathVariable UUID id) {
        return UserResponse.from(userService.getById(id));
    }

}

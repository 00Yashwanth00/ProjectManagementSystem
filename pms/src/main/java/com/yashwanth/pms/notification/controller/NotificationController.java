package com.yashwanth.pms.notification.controller;

import com.yashwanth.pms.common.exception.AccessDeniedException;
import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.service.NotificationService;
import com.yashwanth.pms.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notification> getNotifications(Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return service.getUserNotifications(principal.getId());
    }

    @PatchMapping("/{id}/read")
    public void markRead(
            @PathVariable UUID id,
            Authentication authentication
    ) {

        UserPrincipal principal =
                (UserPrincipal) authentication.getPrincipal();

        Notification n = service.getNotification(id);

        if(n.getUserId() != principal.getId()) {
            throw new AccessDeniedException("Not allowed to mark this as read");
        }
        service.markAsRead(id);
    }

}

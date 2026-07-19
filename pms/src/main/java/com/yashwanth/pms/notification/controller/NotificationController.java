package com.yashwanth.pms.notification.controller;

import com.yashwanth.pms.notification.domain.Notification;
import com.yashwanth.pms.notification.dto.NotificationResponse;
import com.yashwanth.pms.notification.service.NotificationService;
import com.yashwanth.pms.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ============================================================
    // GET Endpoints
    // ============================================================

    @GetMapping
    public List<NotificationResponse> getNotifications(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return notificationService.getUserNotifications(principal.getId())
                .stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/unread/count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        long count = notificationService.getUnreadCount(principal.getId());
        return Map.of("unreadCount", count);
    }

    @GetMapping("/{id}")
    public NotificationResponse getNotification(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Notification notification = notificationService.getNotification(id);

        // ✅ Check if user owns this notification
        if (!notification.getUserId().equals(principal.getId())) {
            throw new com.yashwanth.pms.common.exception.AccessDeniedException(
                    "You are not allowed to view this notification"
            );
        }

        return NotificationResponse.from(notification);
    }

    // ============================================================
    // PATCH Endpoints
    // ============================================================

    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        notificationService.markAsRead(id, principal.getId());
    }

    @PatchMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        notificationService.markAllAsRead(principal.getId());
    }

    // ============================================================
    // DELETE Endpoints
    // ============================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNotification(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        notificationService.deleteNotification(id, principal.getId());
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAllNotifications(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        notificationService.deleteAllNotifications(principal.getId());
    }
}
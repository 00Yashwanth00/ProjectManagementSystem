package com.yashwanth.pms.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "e583075deb8fddfbf436dbad3df6e1984c683b464fe4a9672c2da5289f405134";
    private final long EXPIRATION = 1000 * 60 * 60 * 24; // 24 hours

    public String generateToken(UserPrincipal user) {
        return Jwts.builder()
                .setSubject(user.getEmail())   // ✅ fix: use email, not name
                .claim("userId", user.getId())
                .claim("name", user.getUsername())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

    public String extractUsername(String token) {
        return parse(token).getBody().getSubject();
    }

    public String extractUserId(String token) {
        return parse(token).getBody().get("userId", String.class);
    }

    public String extractUserRole(String token) {
        return parse(token).getBody().get("role", String.class);
    }

    public String extractUserName(String token) {
        return parse(token).getBody().get("name", String.class);
    }

    public String extractUserEmail(String token) {
        return parse(token).getBody().get("email", String.class);
    }

    public boolean validate(String token) {
        parse(token);
        return true;
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET.getBytes())
                .build()
                .parseClaimsJws(token);
    }
}
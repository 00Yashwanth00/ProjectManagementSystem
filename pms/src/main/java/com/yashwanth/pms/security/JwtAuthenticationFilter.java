package com.yashwanth.pms.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // Issue 3 fix: don't clobber an authentication that's already been set on this
        // request (e.g. by another filter earlier in the chain). Cheap defensive check -
        // OncePerRequestFilter already prevents this filter running twice on the same
        // request, but this guards against the broader case regardless.
        boolean alreadyAuthenticated = SecurityContextHolder.getContext().getAuthentication() != null;

        if (header != null && header.startsWith("Bearer ") && !alreadyAuthenticated) {
            String token = header.substring(7);

            try {
                // Issue 1 fix: explicit validation step instead of relying on validation
                // happening only as a side effect inside extractUsername(). Fails fast and
                // makes the intent readable.
                jwtUtil.validate(token);

                String email = jwtUtil.extractUsername(token);
                UserDetails user = userDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException | UsernameNotFoundException ex) {
                // Expired, malformed, tampered token, or the user no longer exists.
                // Leave the request anonymous - downstream authorization rules
                // (.authenticated() / @PreAuthorize) then reject with a clean 401/403
                // instead of this throwing all the way up as a 500.
                logger.debug("JWT authentication failed: {}", ex.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}

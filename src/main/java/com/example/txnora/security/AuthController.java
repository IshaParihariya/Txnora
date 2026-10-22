package com.example.txnora.security;

import com.example.txnora.dto.UserResponse;
import com.example.txnora.service.JwtService;
import com.example.txnora.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    //TO GET REAL USER DATA AND ALL
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService, UserService userService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        //debugging
        log.info("inside login");

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            )
                    );
            //debugging
            log.info("inside login after authentication");


            String email = authentication.getName();

            String role = authentication.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    /*
                    We remove the ROLE_ prefix because your JWT method expects: ADMIN
                     */
                    .replace("ROLE_", "");

            //debugging
            log.info("inside login after getting role :" + role);


            String jwtTokenLogin = jwtService.generateLoginToken(email, role);

            return jwtTokenLogin;
        }
        catch(Exception e)
        {
            log.error("LOGIN AUTHENTICATION FAILED", e);

            throw e;
        }
    }

    //USER INFO
    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
            );
        }

        boolean isAdmin = authentication.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        return userService.getCurrentUser(
                authentication.getName(),
                isAdmin
        );
    }

    //change password
    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        log.info("inside change password auth controller");

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
            );
        }

        log.info("inside auth controller : authentication not null");

        boolean isAdmin = authentication.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        userService.changePassword(
                authentication.getName(),
                isAdmin,
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return Map.of(
                "message",
                "Password changed successfully"
        );
    }
}

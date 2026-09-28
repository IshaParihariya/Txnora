package com.example.txnora.security;

import com.example.txnora.service.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
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
}

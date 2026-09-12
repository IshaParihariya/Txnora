package com.example.txnora.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * for security purpose
 */
 /*
 requestMatchers("api/auth/**").permitAll() :
        here we are specifically telling that these api don't need auth
        bcuz imagine login page or registration page having auth
        so 2 times authorization
        /api/auth/register  → public → create account
        /api/auth/login     → public → authenticate credentials → issue JWT

        /api/transactions   → protected → JWT required
        /api/investigations → protected → JWT + appropriate role required
         */
@Configuration
@EnableWebSecurity
public class SecurityConfig
{
    //password encoder
    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception
    {
        http
                //csrf token disable
                .csrf(csrf -> csrf.disable())
                //authorization of the api
                .authorizeHttpRequests(auth-> auth
                .requestMatchers("/api/auth/**",
                        "/api/user/invite",
                        "/api/user/accept")
                        .permitAll()
                        .anyRequest()
                        .authenticated());


        return http.build();
    }
}

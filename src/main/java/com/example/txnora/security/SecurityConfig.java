package com.example.txnora.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * config
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
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    //password encoder
    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }

    //security filter chain
    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception
    {
        http
                //csrf token disable
                .csrf(csrf -> csrf.disable())
                //authorization of the api
                .authorizeHttpRequests(auth-> auth
                .requestMatchers(
                        "/api/auth/**",
                        "/api/user/accept")
                        .permitAll()
                        .requestMatchers("/api/user/invite").hasRole("ADMIN") //only admin can invite
                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
    //manages the authentication
    //I need this login attempt authenticated
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }


    //does the authentication part
    //I know HOW to authenticate this particular kind of login
    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }


}

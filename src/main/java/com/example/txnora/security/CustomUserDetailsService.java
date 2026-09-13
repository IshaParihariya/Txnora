package com.example.txnora.security;

import com.example.txnora.model.User;
import com.example.txnora.repository.UserRepository;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
/*
Authentication Manager -> Authentication provider -> user details service -> user details
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    public CustomUserDetailsService(
            UserRepository userRepository,
            MongoTemplate mongoTemplate) {

        this.userRepository = userRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        // whenever login happens we are first checking if this is an admin
        Document admin = mongoTemplate
                .getCollection("admin_info")
                .find(new Document("email", username))
                .first();

        if (admin != null) {

            String email = admin.getString("email");
            String passwordHash = admin.getString("passwordHash");
            String role = admin.getString("role");

            return org.springframework.security.core.userdetails.User
                    .withUsername(email)
                    .password(passwordHash)
                    .roles(role)
                    .build();
        }

        // Otherwise check users
        User user = userRepository.findByEmail(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        return new CustomUserDetails(user);
    }
}
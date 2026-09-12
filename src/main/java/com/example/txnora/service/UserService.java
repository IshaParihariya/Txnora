package com.example.txnora.service;

import com.example.txnora.enums.Role;
import com.example.txnora.enums.UserStatus;
import com.example.txnora.model.User;
import com.example.txnora.repository.UserRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * user related logic
 */
@Service
public class UserService
{
    private final UserRepository userRepository;
    //password encoder
    private final PasswordEncoder passwordEncoder;
    //spring's helper for contacting mongodb
    private final MongoTemplate mongoTemplate;
    //email invite
    private final EmailService emailService;
    //jwt service
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, MongoTemplate mongoTemplate, EmailService emailService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mongoTemplate = mongoTemplate;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    //FOR ADMIN LOGIN
    //i didn't want to create an another service for admin as its work was only login thing
    // I'm adding this here only
    public boolean adminLogin(String email,String password) {
        //admin data is in db
        //need to match from there
        org.bson.Document admin = mongoTemplate
                .getCollection("admin_info").
                find(new org.bson.Document("email", email))
                .first();

        if (admin == null) {
            return false;
        }

        String passwordHash = admin.getString("passwordHash");

        return passwordEncoder.matches(password, passwordHash);
    }
    //FOR USERS

    //user service -> email service -> resend service
    //sending mail invites to the user by the admin
    public void inviteUser(String name, String email)
    {

        String token = jwtService.generateInvitationToken(email);

        String invitationLink =
                "http://localhost:5173/accept-invite?token=" + token;

        boolean mailSent= emailService.sendInvitationEmail(
                name,
                email,
                invitationLink
        );

        //this will decide if to store that user or not
        saveUserAfterLinkSent(name,email,mailSent);

    }

    //storing user in the db as pending after sending link
    public User saveUserAfterLinkSent(String name, String email,boolean mailSent)
    {
        if(!mailSent)
        {
            throw new RuntimeException("Invitation email was not sent");
        }

        User user=new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(null); //as now only invite sent
        user.setRole(Role.SUPPORT);
        user.setStatus(UserStatus.PENDING);

        return userRepository.save(user);
    }
}

package com.example.txnora.service;

import com.example.txnora.dto.UserResponse;
import com.example.txnora.enums.Role;
import com.example.txnora.enums.UserStatus;
import com.example.txnora.model.User;
import com.example.txnora.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * user related logic
 */
@Service
@Slf4j
public class UserService
{
    private final UserRepository userRepository;
    //password encoder
    private final PasswordEncoder passwordEncoder;

    //email invite
    private final EmailService emailService;
    //jwt service
    private final JwtService jwtService;

    private final MongoTemplate mongoTemplate;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, JwtService jwtService, MongoTemplate mongoTemplate)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.mongoTemplate = mongoTemplate;
    }

    //FOR USERS

    //user service -> email service -> resend service
    //sending mail invites to the user by the admin
    public void inviteUser(String name, String email)
    {

        //later on also check if admin email this is where we're sending the invite
        // cuz we don't want to invite admins


        log.info("inside invite UserService");
        //if user with this mail exists then don't send invitation
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists");
        }


        //else send
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

    //for accepting invitation from the admin
    public void acceptInvitation(String token, String password, String confirmPassword)
    {
        //here we will extract the email from the token
        //also check if pass and confirm pass matches

        //check if pass and confirm pass matches
        if (!password.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        //extracting the mail from the token from the url
        String email = jwtService.extractEmail(token);

        //find user so we can update the user's info
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //if status != pending there is something wrong
        if (user.getStatus() != UserStatus.PENDING) {
            throw new RuntimeException(
                    "User has already accepted the invitation"
            );
        }

        //encoding the password
        user.setPasswordHash(
                passwordEncoder.encode(password)
        );

        //updating status
        user.setStatus(UserStatus.ACTIVE);

        //update in the database
        userRepository.save(user);
    }

    //fetching all users data
    public List<UserResponse> getAllUsers()
    {
        log.info("inside getAllUsers service");
        List<UserResponse> responseList = userRepository
                .findAll()
                .stream()
                .map((user)->
                        {
                            UserResponse userResponse=new UserResponse(
                                    user.getName(),
                                    user.getEmail(),
                                    user.getRole(),
                                    user.getStatus(),
                                    user.getId()
                            );
                            return userResponse;
                        })
                .toList();

        log.info("response list : "+responseList);

        return responseList;
    }

    public UserResponse getCurrentUser(String email, boolean isAdmin) {

        // ADMIN: fetch profile from admin_info
        if (isAdmin) {
            Document admin = mongoTemplate
                    .getCollection("admin_info")
                    .find(new Document("email", email))
                    .first();

            if (admin == null) {
                throw new RuntimeException("Admin not found");
            }

            String name = admin.getString("name");
            String adminEmail = admin.getString("email");

            Object id = admin.get("_id");

            return new UserResponse(
                    name,
                    adminEmail,
                    Role.ADMIN,
                    null,
                    id != null ? id.toString() : null
            );
        }

        // SUPPORT: fetch profile from users
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new UserResponse(
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getId()
        );
    }
}

package com.example.txnora.service;

import com.example.txnora.dto.UserResponse;
import com.example.txnora.enums.Role;
import com.example.txnora.enums.UserStatus;
import com.example.txnora.model.User;
import com.example.txnora.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

        //HARDCODING THIS HERE CUZ SIMPLE RN SO..
        String invitationLink =
                "https://txnora-sigma.vercel.app/accept-invite?token=" + token;

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

        //we checking if token exists
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invitation token is required"
            );
        }

        if (password == null || password.isBlank()
                || confirmPassword == null || confirmPassword.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password and confirmation are required"
            );
        }

        if (password.length() < 8) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must contain at least 8 characters"
            );
        }

        //check if pass and confirm pass matches
        if (!password.equals(confirmPassword)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Passwords do not match"
            );
        }


        final String email;

        try {
            email = jwtService.extractEmail(token);
        } catch (io.jsonwebtoken.JwtException
                 | IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invitation link is invalid or has expired"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No account was found for this invitation"
                ));

        if (user.getStatus() != UserStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This invitation has already been accepted"
            );
        }

        user.setPasswordHash(passwordEncoder.encode(password));
        user.setStatus(UserStatus.ACTIVE);

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

    //change password
    public void changePassword(
            String email,
            boolean isAdmin,
            String currentPassword,
            String newPassword) {

        log.info("inside user service : change password");

        // Validate input
        if (currentPassword == null || currentPassword.isBlank()
                || newPassword == null || newPassword.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password and new password are required"
            );
        }
        log.info("inside user service : old password or new password not null");

        if (newPassword.length() < 8) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must contain at least 8 characters"
            );
        }

        log.info("inside user service : password length > 8 ");

        //  Fetch account according to the authenticated role
        String passwordHash;

        if (isAdmin) {

            log.info("inside user service : admin");

            Document admin = mongoTemplate
                    .getCollection("admin_info")
                    .find(new Document("email", email))
                    .first();

            if (admin == null) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found"
                );
            }

            passwordHash = admin.getString("passwordHash");

        } else {

            log.info("inside user service : user");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Account not found"
                    ));

            passwordHash = user.getPasswordHash();
        }

        //  Apply the same password rules to both account types
        if (passwordHash == null ||
                !passwordEncoder.matches(currentPassword, passwordHash)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect"
            );
        }

        if (passwordEncoder.matches(newPassword, passwordHash)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must differ from current password"
            );
        }

        //  Hash the new password
        String newPasswordHash = passwordEncoder.encode(newPassword);

        // Update the appropriate collection
        if (isAdmin) {

            mongoTemplate.getCollection("admin_info").updateOne(
                    new Document("email", email),
                    new Document(
                            "$set",
                            new Document("passwordHash", newPasswordHash)
                    )
            );

        } else {

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Account not found"
                    ));

            user.setPasswordHash(newPasswordHash);
            userRepository.save(user);

            log.info("inside user service : new password set!");
        }
    }
}

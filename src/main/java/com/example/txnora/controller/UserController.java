package com.example.txnora.controller;

import com.example.txnora.dto.AcceptInvitationRequest;
import com.example.txnora.dto.UserResponse;
import com.example.txnora.model.User;
import com.example.txnora.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * user related stuff includes inviting the user by the admin
 */
@RestController
@RequestMapping("/api/user")
@Slf4j
public class UserController
{
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    //inviting user
    @PostMapping("/invite")
    public void inviteUser(@RequestParam String name, @RequestParam String email)
    {
        log.info("inside invite");
        userService.inviteUser(name,email);
    }

    //user accepting/confirming the invite sent by the admin
    @PostMapping("/accept")
    public void acceptInvitation(@RequestBody AcceptInvitationRequest request)
    {
        //from url we take token
        //and pass and confirm pass from user
        userService.acceptInvitation(
                request.getToken(),
                request.getPassword(),
                request.getConfirmPassword()
        );
    }

    //fetching all users data to show on the ui
    @GetMapping("/all")
    public List<UserResponse> getAllUsers()
    {
        log.info("inside getAllUsers");
        return userService.getAllUsers();
    }

}

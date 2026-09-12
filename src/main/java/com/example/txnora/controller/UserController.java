package com.example.txnora.controller;

import com.example.txnora.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * user related stuff includes inviting the user by the admin
 */
@RestController
@RequestMapping("/api/user")
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
        userService.inviteUser(name,email);
    }
}

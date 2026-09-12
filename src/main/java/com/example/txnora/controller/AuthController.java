package com.example.txnora.controller;

import com.example.txnora.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/***
 * for all authorization purpose
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController
{
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    //for admin logging
    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(@RequestParam String email, @RequestParam String password)
    {
        boolean success =userService.adminLogin(email,password);

        if(!success)
        {
            ResponseEntity.status(401).body("Invalid Credentials");
        }

        return ResponseEntity.ok("Admin login successful");
    }

}

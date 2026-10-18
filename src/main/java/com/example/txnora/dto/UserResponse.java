package com.example.txnora.dto;

import com.example.txnora.enums.Role;
import com.example.txnora.enums.UserStatus;

/*
to fetch user data and show on the ui Users in the sidebar
for admin specifically
support wouldn't be able to see this
 */
public class UserResponse
{
    private String id;

    private String name;

    private String email;

    private Role role;

    private UserStatus status;

    public UserResponse() {
    }

    public UserResponse(String name, String email,
                Role role, UserStatus status, String id) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.id=id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", status=" + status +
                '}';
    }

}

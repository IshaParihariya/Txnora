package com.example.txnora.dto;

/**
 * info from react ui to the controller
 * password
 * token from url
 * confirm password
 */
public class AcceptInvitationRequest {

    private String token;
    private String password;
    private String confirmPassword;

    public AcceptInvitationRequest() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
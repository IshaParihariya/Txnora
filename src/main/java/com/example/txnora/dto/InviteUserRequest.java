package com.example.txnora.dto;

/**
 * sending request to user for invite
 */
public class InviteUserRequest
{
        private String name;
        private String email;

        public InviteUserRequest() {
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

}

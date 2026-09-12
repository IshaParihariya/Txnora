package com.example.txnora.service;

/**
 * in order to send invites to users
 * user service -> email service -> resend service
 */
public interface EmailService
{
     boolean sendInvitationEmail(String name, String email, String invitationLink);
}

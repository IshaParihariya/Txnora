package com.example.txnora.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CancelEmailResponse;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/***
 * using resend to send invite
 */
@Slf4j
@Service
public class ResendEmailService implements EmailService
{
    //we have added maven dependency so
    private final Resend resend;

    public ResendEmailService()
    {
        this.resend = new Resend(System.getenv("RESEND_API_KEY"));
    }

    @Override
    public boolean sendInvitationEmail(String name, String email, String invitationLink)
    {
        //Resend has these built in stuff that we're using here
        // comes from Resend : CreateEmailOptions
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")
                .to(email)
                .subject("You're invited to Txnora")
                .html(
                        "<h2>Welcome to Txnora, " + name + "!</h2>" +
                                "<p>You have been invited to join Txnora.</p>" +
                                "<p>Click the link below to set your password:</p>" +
                                "<a href=\"" + invitationLink + "\">Accept Invitation</a>" +
                                "<p>This invitation will expire in 1 hour.</p>"
                )
                .build();

        try {
            resend.emails().send(params);
            return true;
        } catch (ResendException e)
        {
            log.warn("Failed to send the invitation email", e);
            return false;
        }
    }

}


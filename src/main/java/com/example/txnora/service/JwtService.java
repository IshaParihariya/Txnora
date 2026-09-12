package com.example.txnora.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * jwt related stuff
 */
@Service
public class JwtService
{
    private final SecretKey secretKey;

    public JwtService() {

        String secret = "txnora-secret-key-for-jwt-token-generation-123456";

        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    //here generating token
    //using user email
    //so when user tries to accept invite with pass
    //we will get the mail
    //so we can use it later for updation in the db
    //of the user info
    public String generateInvitationToken(String email)
    {
        Date now = new Date();

        Date expiration = new Date(
                now.getTime() + 60 * 60 * 1000
        );

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    //extraction of mail from token from url
    public String extractEmail(String token)
    {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}

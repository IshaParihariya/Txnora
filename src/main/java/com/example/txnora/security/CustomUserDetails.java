package com.example.txnora.security;

import com.example.txnora.enums.UserStatus;
import com.example.txnora.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * for security purpose
 */
/*
spring security doesn't directly use User model from the db
instead need UserDetails for that
so here we are taking info we needed for security from User

user detail service gets the user data from the db
now we have user so
we need to give Spring Security that user in the format it understands => UserDetails
 */
public class CustomUserDetails implements UserDetails
{
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

/*
? extends GrantedAuthority means the collection can contain any
type that implements GrantedAuthority, such as Spring Security's SimpleGrantedAuthority
 */
    //role based authority here
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name()
                )
        );
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    //for security user name is which is used for login purpose
    //that is email here
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    //we dont have this so true
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //this also
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //this as well
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //here we can do this
    //if account is activated then enabled
    //if pending or disabled then NOT enabled
    @Override
    public boolean isEnabled() {
        return user.getStatus()== UserStatus.ACTIVE;
    }
}

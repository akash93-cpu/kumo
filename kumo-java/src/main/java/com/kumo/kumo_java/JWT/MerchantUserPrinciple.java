package com.kumo.kumo_java.JWT;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.kumo.kumo_java.merchant.MerchantEntity;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class MerchantUserPrinciple implements UserDetails {
	
	private final MerchantEntity merchantEntity;
	
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null; 
    }

    @Override
    public String getPassword() {
        return merchantEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return merchantEntity.getEmail();
    }
    
    // To get the user name
    public String getUserString() {
    	return merchantEntity.getUserName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return merchantEntity.isActive();
    }

}

package com.kumo.kumo_java.JWT;

import java.security.NoSuchAlgorithmException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.kumo.kumo_java.merchant.MerchantEntity;
import com.kumo.kumo_java.merchant.MerchantService;

import lombok.AllArgsConstructor;
import lombok.experimental.var;

@Service
@AllArgsConstructor
public class ApplicationUserDetailsServiceM implements UserDetailsService {
	
	private final MerchantService merchantService;
	
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		MerchantEntity merchant = merchantService.findAnyByEmail(email);
		
		if (merchant == null) throw new UsernameNotFoundException("User not found with email: " + email);
		
		return new MerchantUserPrinciple(merchant);
	}
	
	private Boolean verifyPasswordHash(String password, String passwordHash) throws NoSuchAlgorithmException {
		
		if (password.isBlank() || password.isEmpty())
			throw new IllegalArgumentException("Password cannot be empty or whitespace only string.");

		return BCrypt.checkpw(password, passwordHash);
	}
	
	public MerchantEntity authenticateMerchant(String email, String password) throws NoSuchAlgorithmException {
	    if (email.isBlank() || password.isBlank()) 
	        throw new BadCredentialsException("Unauthorized");
	    
	    var merchantEntity = merchantService.findAnyByEmail(email);
	    if (merchantEntity == null) throw new BadCredentialsException("Not authorized!");
	    
	    var verified = verifyPasswordHash(password, merchantEntity.getPassword());
	    if (!verified) throw new BadCredentialsException("Unauthorized");
	    
	    return merchantEntity;

	}
	
	public MerchantEntity checkAccountState(String email) throws NoSuchAlgorithmException {
		var merchantEntity = merchantService.findAnyByEmail(email);
		if (!merchantEntity.isActive()) throw new BadCredentialsException("Merchant is not yet verified! Please verify your account!");
		
		return merchantEntity;
	}
	
}

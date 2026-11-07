package com.kumo.kumo_java.token;

import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
class TokenService {
	
	private final TokenRepoC tokenRepoCustomer;
	
	public Optional<TokenEntityCustomer> findByToken(String token) {
		return tokenRepoCustomer.findByToken(token);
	}
	
	public void save(TokenEntityCustomer token) {
		tokenRepoCustomer.save(token);
	}

}

@Service
@AllArgsConstructor
class TokenServiceMerchant {
	
	private final TokenRepoM tokenRepoMerchant;
	
	public Optional<TokenEnetityMerchant> findByToken(String token) {
		return tokenRepoMerchant.findByToken(token);
	}
	
	public void save(TokenEnetityMerchant token) {
		tokenRepoMerchant.save(token);
	}
	
	
}
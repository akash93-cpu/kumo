package com.kumo.kumo_java.token;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepoC extends JpaRepository<TokenEntityCustomer, Long> {

	Optional<TokenEntityCustomer> findByToken(String token);

}

interface TokenRepoM extends JpaRepository<TokenEnetityMerchant, Long> {
	
	Optional<TokenEnetityMerchant> findByToken(String token);
	
}
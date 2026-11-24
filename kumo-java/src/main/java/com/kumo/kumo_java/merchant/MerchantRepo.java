package com.kumo.kumo_java.merchant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface MerchantRepo extends JpaRepository<MerchantEntity, Integer> {
	
	Boolean existsByEmail(String emailString);
	Boolean existsByUserName(String userNameString);
	Boolean existsByPhone(String phoneString);
	
	Optional<MerchantEntity> findByEmail(String email);
	void deleteByEmail(String email);

}

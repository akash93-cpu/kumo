package com.kumo.kumo_java.stores;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoresRepo extends JpaRepository<StoresEntity, Integer> {
	
	Optional<StoresEntity> findByMerchant_MerchantId(Integer merchantId);
	void deleteById(Integer id);
	
}

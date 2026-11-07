package com.kumo.kumo_java.customer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepo extends JpaRepository<CustomerEntity, Integer> {

	Boolean existsByEmail(String emailString);
	Boolean existsByUserName(String userNameString);

}

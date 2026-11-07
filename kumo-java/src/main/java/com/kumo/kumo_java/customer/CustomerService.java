package com.kumo.kumo_java.customer;
import java.security.NoSuchAlgorithmException;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.kumo.kumo_java.exceptions.BadRequestException;
import com.kumo.kumo_java.merchant.MerchantRepo;

import lombok.AllArgsConstructor;
import lombok.experimental.var;

@AllArgsConstructor
@Service
public class CustomerService {

	private final CustomerRepo repositoryC;
	public final MerchantRepo repoM;
	public final ModelMapper mapper;

	private CustomerDTO convertToData(CustomerEntity entity) {
		return mapper.map(entity, CustomerDTO.class);
	}

	private CustomerEntity convertToEntity(CustomerDTO convertToData) {
		return mapper.map(convertToData, CustomerEntity.class);
	}

	@SuppressWarnings("deprecation")
	public CustomerDTO createCustomer(CustomerDTO customerDto, String password) throws NoSuchAlgorithmException {

		// this method will create the user in the system but will not enable the user

		if (password == null || password.isBlank()) {
			throw new IllegalArgumentException("Password required!");
		}

		String normalizedEmailString = customerDto.getEmail().trim().toLowerCase();
		customerDto.setEmail(normalizedEmailString);
		
		String normalizedMerchantUsernameString = customerDto.getUserName().trim();
		customerDto.setUserName(normalizedMerchantUsernameString);

		String passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());

		var user = convertToEntity(customerDto);

		var existsEmail = repositoryC.existsByEmail(customerDto.getEmail());
		var existsMerchantEmail = repoM.existsByEmail(normalizedEmailString);
		if (existsEmail) throw new BadRequestException("Email " + user.getEmail() + " is taken!");
		if (existsMerchantEmail) throw new BadRequestException("Email already exists by merchant!");
		
		var existsUsername = repositoryC.existsByUserName(customerDto.getUserName());
		var existsMerchantUsername = repoM.existsByUserName(normalizedMerchantUsernameString);
		if (existsUsername) throw new BadRequestException("Username " + user.getUserName() + " is taken!");
		if (existsMerchantUsername) throw new BadRequestException("Username already taken by merchant!");

		user.setPassword(passwordHash);

		repositoryC.save(user);

//		String token = UUID.randomUUID().toString(); // token and email verification here
//		TokenEntity confirmToken = new TokenEntity(
//				token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(15), user);
//		tokenService.save(confirmToken);
//		emailService.sendSimpleEmail(customerDto.getEmail(), token);

		return convertToData(user);
	}

}

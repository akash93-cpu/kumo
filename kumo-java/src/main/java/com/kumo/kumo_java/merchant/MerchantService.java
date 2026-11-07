package com.kumo.kumo_java.merchant;

import java.security.NoSuchAlgorithmException;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.kumo.kumo_java.customer.CustomerRepo;
import com.kumo.kumo_java.exceptions.BadRequestException;

import lombok.AllArgsConstructor;
import lombok.experimental.var;

@AllArgsConstructor
@Service
public class MerchantService {
	
	public final MerchantRepo repositoryM;
	public final CustomerRepo repoC;
	public final ModelMapper mapper;
	
	private MerchantDTO convertToData(MerchantEntity entity) {
		return mapper.map(entity, MerchantDTO.class);
	}
	
	private MerchantEntity convertToEntity(MerchantDTO convertToData) {
		return mapper.map(convertToData, MerchantEntity.class);
	}
	
	public MerchantEntity findAnyByEmail(String email) {
		return repositoryM.findUserByEmail(email);
	}
	
	public MerchantDTO createMerchant(MerchantDTO merchantDto, String password) throws NoSuchAlgorithmException {
		
		// this method will create the user in the system but will not enable the user
		
		if (password == null || password.isBlank()) {
			throw new IllegalArgumentException("Password required!");
		}
		String normalizedEmailString = merchantDto.getEmail().trim().toLowerCase();
		merchantDto.setEmail(normalizedEmailString);
		
		String normalizedUsernameString = merchantDto.getUserName().trim();
		merchantDto.setUserName(normalizedUsernameString);

		String passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());
		
		var user = convertToEntity(merchantDto);
		
		var existsEmail = repositoryM.existsByEmail(merchantDto.getEmail());
		var existsCustomerEmail = repoC.existsByEmail(normalizedEmailString);
		if (existsEmail) throw new BadRequestException("Email " + user.getEmail() + " is taken!");
		if (existsCustomerEmail) throw new BadRequestException("Email is already taken by customer!");
		
		var existsUsername = repositoryM.existsByUserName(merchantDto.getUserName());
		var existsCustomerUsername = repoC.existsByUserName(normalizedUsernameString);
		if (existsUsername) throw new BadRequestException("Username " + user.getUserName() + " is taken!");
		if (existsCustomerUsername) throw new BadRequestException("Username is already taken by customer!");
		
		var existsPhone = repositoryM.existsByPhone(merchantDto.getPhone());
		if (existsPhone) throw new BadRequestException("Phone " + user.getPhone() + " is taken!");
		
		user.setPassword(passwordHash);

		repositoryM.save(user);
		return convertToData(user);
		
	}
}

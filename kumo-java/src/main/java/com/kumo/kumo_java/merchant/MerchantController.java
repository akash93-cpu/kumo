package com.kumo.kumo_java.merchant;

import java.security.NoSuchAlgorithmException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class MerchantController {

	private final MerchantService service;
	
	@PostMapping("/create-merchant")
	@CrossOrigin(origins="http://localhost:5173")
	@ResponseStatus(HttpStatus.CREATED)
	public MerchantDTO createMerchant(@Valid @RequestBody MerchantDTO merchantDTO) throws NoSuchAlgorithmException {		
		return service.createMerchant(merchantDTO, merchantDTO.getPassword());
	}
	
	@DeleteMapping("/delete-merchant/{email}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteMerchant(@PathVariable("email") String email) {
		service.removeMerchantByEmail(email);
	}
		
}
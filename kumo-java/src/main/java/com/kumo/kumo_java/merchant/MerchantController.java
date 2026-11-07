package com.kumo.kumo_java.merchant;

import java.security.NoSuchAlgorithmException;

import org.springframework.http.HttpStatus;
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
	@ResponseStatus(HttpStatus.CREATED)
	public MerchantDTO createMerchant(@Valid @RequestBody MerchantDTO merchantDTO) throws NoSuchAlgorithmException {		
		return service.createMerchant(merchantDTO, merchantDTO.getPassword());
	}
	
}
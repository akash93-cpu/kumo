package com.kumo.kumo_java.customer;

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
public class CustomerController {

	private final CustomerService service;

	@PostMapping("/create-customer")
	@ResponseStatus(HttpStatus.CREATED)
	public CustomerDTO createCustomer(@Valid @RequestBody CustomerDTO customerDTO) throws NoSuchAlgorithmException {
		return service.createCustomer(customerDTO, customerDTO.getPassword());
	}
}

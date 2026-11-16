package com.kumo.kumo_java.stores;

import java.security.NoSuchAlgorithmException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/stores")
public class StoresController {
	
	private final StoresService service;
	
	@PostMapping("/create-store")
	@ResponseStatus(HttpStatus.CREATED)
	public StoreDto createStore(@Valid @RequestBody StoreDto storeDto) throws NoSuchAlgorithmException {
		return service.createStore(storeDto);
	}
	
	@DeleteMapping("/delete-store/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteByStoreId(@PathVariable("id") Integer id) {
		service.removeStoreById(id);
	}
	
}

package com.kumo.kumo_java.stores;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/stores")
public class StoresController {
	
	private final StoresService service;
	
	@PostMapping("/create-store")
	@ResponseStatus(HttpStatus.CREATED)
	@CrossOrigin(origins="http://localhost:5173")
	@PreAuthorize("isAuthenticated()")
	public StoreDto createStore(@Valid @RequestBody StoreDto storeDto, HttpServletRequest req) throws NoSuchAlgorithmException {
		return service.createStore(storeDto, req);
	}
	
	@GetMapping("/list-store")
	@PreAuthorize("isAuthenticated()")
	@CrossOrigin(origins="http://localhost:5173")
	@ResponseStatus(HttpStatus.OK)
	public List<StoresEntity> returnMyStore(HttpServletRequest req) {
		return service.listMyStore(req);
	}
	
	@DeleteMapping("/delete-store/{id}")
	@PreAuthorize("isAuthenticated()")
	@CrossOrigin(origins="http://localhost:5173")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteByStoreId(HttpServletRequest req) {
		service.removeStoreById(req);
	}
	
}

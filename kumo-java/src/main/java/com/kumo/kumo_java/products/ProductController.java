package com.kumo.kumo_java.products;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/products")
public class ProductController {
	
	private final ProductsService prodServ;
	
	@PostMapping("/add-product")
	@ResponseStatus(HttpStatus.CREATED)
	public ProductsDto addProduct(@Valid @RequestBody ProductsDto productsDto) throws
	NoSuchAlgorithmException {
		return prodServ.createProduct(productsDto);
	}
	
	@GetMapping("/return-all-products/{storeId}")
	@ResponseStatus(HttpStatus.OK)
	public List<ProductsDto> getAllProducts(@PathVariable int storeId) {
		return prodServ.getAllProductsInStore(storeId);
	}
	
	@DeleteMapping("/remove-product/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteByProductId(@PathVariable("id") UUID id) {
		prodServ.removeProductById(id);
	}
	
}

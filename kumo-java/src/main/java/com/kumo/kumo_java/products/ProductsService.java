package com.kumo.kumo_java.products;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.kumo.kumo_java.exceptions.NotFoundException;
import com.kumo.kumo_java.stores.StoresEntity;
import com.kumo.kumo_java.stores.StoresRepo;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductsService {

	public final ProductRepo productRepo;
	public final ModelMapper mapper;
	private final StoresRepo storesRepo;
	
	private ProductsDto convertToData(ProductsEntity entity) {
		ProductsDto dto = mapper.map(entity, ProductsDto.class);
		dto.setStoreId(entity.getStore().getStoreId());
		return dto;
	}
	
	private ProductsEntity convertToEntity(ProductsDto convertToData) {
		return mapper.map(convertToData, ProductsEntity.class);
	}
	
	public void removeProductById(UUID id) {
		findOrThrow(id);
		productRepo.deleteById(id);
	}
	
	public ProductsEntity findOrThrow(final UUID id) {
		return productRepo.findById(id)
				.orElseThrow(() -> new NotFoundException("Product with id " + id + " does not exist!"));
	}
	
	public List<ProductsDto> getAllProductsInStore(int store_id) {
		List<ProductsEntity> resultSet = productRepo.findAllByStore_StoreId(store_id); 
		if (resultSet.isEmpty()) throw new NotFoundException("No products found in store with id " + store_id);
		return resultSet.stream()
				.map(this::convertToData).toList();
	}
	
	public ProductsDto createProduct(ProductsDto productsDto) {
		
		// this method will create a product for a store
		
		StoresEntity stores = storesRepo.findById(productsDto.getStoreId())
				.orElseThrow(() -> new RuntimeException("Store not found!"));
		
		ProductsEntity products = convertToEntity(productsDto);
		products.setStore(stores);
		ProductsEntity savedProduct = productRepo.save(products);
		
		return convertToData(savedProduct); 
				
	}
	
}

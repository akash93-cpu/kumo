package com.kumo.kumo_java.products;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<ProductsEntity, UUID> {
	
	Optional<ProductsEntity> findByStore_StoreId(Integer storeId);
	List<ProductsEntity> findAllByStore_StoreId(Integer storeId);

}

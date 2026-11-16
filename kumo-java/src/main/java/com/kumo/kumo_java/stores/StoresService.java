package com.kumo.kumo_java.stores;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.kumo.kumo_java.exceptions.NotFoundException;
import com.kumo.kumo_java.merchant.MerchantEntity;
import com.kumo.kumo_java.merchant.MerchantRepo;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StoresService {
	
	public final StoresRepo storesRepo;
	public final ModelMapper mapper;
	private final MerchantRepo merchantRepo;
	
	private StoreDto convertToData(StoresEntity entity) {
		StoreDto dto = mapper.map(entity, StoreDto.class);
		dto.setMerchantId(entity.getMerchant().getMerchantId());
		return dto;
	}
	
	private StoresEntity convertToEntity(StoreDto convertToData) {
		return mapper.map(convertToData, StoresEntity.class);
	}
	
	public StoreDto createStore(StoreDto storeDto) {
		
		// this method will create a store for a merchant
		
		MerchantEntity merchant = merchantRepo.findById(storeDto.getMerchantId())
				.orElseThrow(() -> new RuntimeException("Merchant not found!"));
		
		if (storesRepo.findByMerchant_MerchantId(merchant.getMerchantId()).isPresent()) 
			throw new RuntimeException("Merchant already has an existing store!");
		
		StoresEntity stores = convertToEntity(storeDto);
		stores.setMerchant(merchant);
		StoresEntity savedStore = storesRepo.save(stores);
		
		return convertToData(savedStore);
		
	}
	
	public void removeStoreById(Integer id) {
		findOrThrow(id);
		storesRepo.deleteById(id);
	}
	
	private StoresEntity findOrThrow(final Integer id) {
		return storesRepo.findById(id)
				.orElseThrow(() -> new NotFoundException("Store with id " + id + " not found!"));
	}
	
}
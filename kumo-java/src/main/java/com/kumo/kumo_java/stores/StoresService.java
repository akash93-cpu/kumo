package com.kumo.kumo_java.stores;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.kumo.kumo_java.JWT.JwtUtil;
import com.kumo.kumo_java.exceptions.NotFoundException;
import com.kumo.kumo_java.merchant.MerchantEntity;
import com.kumo.kumo_java.merchant.MerchantRepo;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StoresService {
	
	public final StoresRepo storesRepo;
	public final ModelMapper mapper;
	private final MerchantRepo merchantRepo;
	private final JwtUtil jwtUtil;
	
	private StoreDto convertToData(StoresEntity entity) {
		StoreDto dto = mapper.map(entity, StoreDto.class);
		return dto;
	}
	
    private StoresEntity convertToEntity(StoreDto dto) {
        return mapper.map(dto, StoresEntity.class);
    }
	
	private int extractMerchantId(HttpServletRequest req) {
		
		String jwt = null;
	    if (req.getCookies() != null) {
	        for (Cookie cookie : req.getCookies()) {
	            if ("jwt".equals(cookie.getName())) {
	                jwt = cookie.getValue();
	                break;
	            }
	        }
	    }

	    if (jwt == null) {
	        System.out.println("JWT cookie not found");
	    }
	     
	    return jwtUtil.extractMerchantId(jwt); 

	}
	
	public StoreDto createStore(StoreDto storeDto , HttpServletRequest req) {
		
		// this method will create a store for a merchant
		
        int merchantId = extractMerchantId(req);

		MerchantEntity merchant = merchantRepo.findById(merchantId)
				.orElseThrow(() -> new RuntimeException("Merchant not found!"));
		
		if (storesRepo.findByMerchant_MerchantId(merchantId).isPresent()) // checks whether merchant already has a store  
			throw new RuntimeException("Merchant already has an existing store!");
		
		StoresEntity stores = convertToEntity(storeDto);
		stores.setMerchant(merchant);
		StoresEntity savedStore = storesRepo.save(stores);
		
		return convertToData(savedStore);
		
	}
	
	public void removeStoreById(HttpServletRequest req) {
		
		int merchantId = extractMerchantId(req);
		findOrThrow(merchantId);
		storesRepo.deleteById(merchantId);
		
	}
	
	private StoresEntity findOrThrow(final Integer id) {
		return storesRepo.findById(id)
				.orElseThrow(() -> new NotFoundException("Store with id " + id + " not found!"));
	}
	
}
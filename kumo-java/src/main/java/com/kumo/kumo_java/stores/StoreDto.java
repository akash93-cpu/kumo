package com.kumo.kumo_java.stores;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreDto {
	
    @NotNull(message = "No merchant id provided!")
    @Positive(message = "Merchant ID must be greater than 0!")
    private Integer merchantId;

	@NotBlank(message = "Store name cannot be blank!")
	private String storeName;
	
	private String description;
	private String location;
	private LocalDateTime createdAt;
	
}

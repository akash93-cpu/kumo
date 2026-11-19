package com.kumo.kumo_java.stores;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreDto {
	
	@NotBlank(message = "Store name cannot be blank!")
	private String storeName;
	
	private String description;
	private String location;
	private LocalDateTime createdAt;
	
}

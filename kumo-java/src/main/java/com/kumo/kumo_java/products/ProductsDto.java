package com.kumo.kumo_java.products;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductsDto {
	
	@NotNull(message = "Please enter a valid UUID!")
	private UUID productId;
	
    @NotNull(message = "No store id provided!")
    @Positive(message = "Store ID must be greater than 0!")
    private Integer storeId;
	
    @NotNull(message = "Product name cannot be blank!")
	private String productName;
	private String description;
	
	@NotNull(message = "Price cannot be null!")
	@DecimalMin(value = "0.01", message = "Price must be greater than 0!")
	private BigDecimal price;
	@PositiveOrZero(message = "Stock quantity cannot be negative!")
	private Integer stockQuantity;
	@NotBlank(message = "Product status cannot be blank!")
	private String status;

}

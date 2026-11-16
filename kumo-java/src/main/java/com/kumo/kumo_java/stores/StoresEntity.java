package com.kumo.kumo_java.stores;

import java.time.LocalDateTime;

import com.kumo.kumo_java.merchant.MerchantEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "stores")
public class StoresEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "store_id")
	private int storeId;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "merchant_id",
	referencedColumnName = "merchant_id",
	nullable = false, unique = true)
	private MerchantEntity merchant;
	
	@Column(name = "store_name", nullable = false)
	private String storeName;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	@Column(name = "location")
	private String location;
	
}

package com.kumo.kumo_java.token;

import java.time.LocalDateTime;

import com.kumo.kumo_java.customer.CustomerEntity;
import com.kumo.kumo_java.merchant.MerchantEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "confirmation_token_customer")
class TokenEntityCustomer {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long id;
    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime confirmedAt;

    @ManyToOne
    @JoinColumn(nullable = false, name = "customer_id")
    private CustomerEntity customer;

    public TokenEntityCustomer(String token, LocalDateTime createdAt,
                       LocalDateTime expiresAt, CustomerEntity customer) {
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.customer = customer;
    }

}

@Data
@NoArgsConstructor
@Entity
@Table(name = "confirmation_token_merchant")
class TokenEnetityMerchant {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private long id;
    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime confirmedAt;

    @ManyToOne
    @JoinColumn(nullable = false, name = "merchant_id")
    private MerchantEntity merchant;
    
    public TokenEnetityMerchant(String token, LocalDateTime createdAt,
    		LocalDateTime expiresAt, MerchantEntity merchant) {
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.merchant = merchant;
    }
    
}
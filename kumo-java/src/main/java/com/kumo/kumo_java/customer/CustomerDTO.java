package com.kumo.kumo_java.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO {

    @NotBlank(message = "Email cannot be empty!")
    @Email(message = "Invalid email format!")
    private String email;

    @NotBlank(message = "Username cannot be empty!")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username cannot contain special characters or spaces!")
	private String userName;

    @NotBlank(message = "Password cannot be empty!")
    @Size(min = 8, max = 16, message = "Password not strong enough!")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        message = "Password not strong enough!")
	private String password;

}

package com.kumo.kumo_java.JWT;


import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest implements Serializable {
	private String email;
	private String password;
}

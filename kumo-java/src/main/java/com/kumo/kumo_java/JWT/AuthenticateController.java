package com.kumo.kumo_java.JWT;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kumo.kumo_java.merchant.MerchantEntity;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@CrossOrigin(allowedHeaders="Content-Type")
public class AuthenticateController {
	
	private final JwtUtil jwtUtil;
	private final ApplicationUserDetailsServiceM merchantM;
	
	@PostMapping("/login")
	@ResponseStatus(HttpStatus.CREATED)
	public void authenticate(@RequestBody AuthRequest req, HttpServletResponse response) throws Exception {
		
		MerchantEntity user;
		
		try {
			user = merchantM.authenticateMerchant(req.getEmail(), req.getPassword());
		} catch (BadCredentialsException e) {
			throw new Exception("Incorrect Username or Password!", e);
		}
		
		try {
			user = merchantM.checkAccountState(req.getEmail());
		} catch (BadCredentialsException e) {
			throw new Exception("Account not yet active! Please verify your account!", e);
		}
		
		var userDetails = merchantM.loadUserByUsername(user.getEmail());
//		System.out.println(userDetails);
		var jwt = jwtUtil.generateToken(userDetails);
		
		Cookie cookie = new Cookie("jwt", jwt);
		cookie.setHttpOnly(true);
		cookie.setSecure(false);
		cookie.setPath("/");
		cookie.setMaxAge(12 * 60 * 60); // 12 hour cookie lifetime
		
		response.addCookie(cookie);
		
	}
	
	@GetMapping("/get-email")
	public String getUserEmail(HttpServletRequest req) {
		String jwtString = null;
		if (req.getCookies() != null) {
			for (Cookie cookie : req.getCookies()) {
				if ("jwt".equals(cookie.getName())) {
					jwtString = cookie.getValue();
					break;
				}
			}
		}
		if (jwtString == null) System.out.println("JWT cookie not found.");
		String emailString = jwtUtil.extractUsername(jwtString);
		return emailString;
	}
	
	@GetMapping("/user-token")
	public String getUsernameToken(HttpServletRequest request) {
		
	    String jwt = null;
	    if (request.getCookies() != null) {
	        for (Cookie cookie : request.getCookies()) {
	            if ("jwt".equals(cookie.getName())) {
	                jwt = cookie.getValue();
	                break;
	            }
	        }
	    }

	    if (jwt == null) {
	        System.out.println("JWT cookie not found");
	    }

	    String username = jwtUtil.extractActualUsername(jwt);
	    return username;
	    
	}	
	
	@PostMapping("/logout")
	@CrossOrigin(origins="http://13.60.77.226:5173")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void logout(HttpServletResponse res) {
		
		Cookie cookie = new Cookie("jwt", null);
		cookie.setHttpOnly(true);
		cookie.setSecure(false);
		cookie.setPath("/");
		cookie.setMaxAge(0);
		
		res.addCookie(cookie);
		
	}


}

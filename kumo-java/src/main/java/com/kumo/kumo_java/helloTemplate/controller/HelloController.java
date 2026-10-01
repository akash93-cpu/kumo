package com.kumo.kumo_java.helloTemplate.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class HelloController {
	
    @GetMapping("/")
    public String hello(Model model) {
        model.addAttribute("message", "Hello from Kumo - Spring Boot! This is a test page.");
        return "hello_template"; 
    }
    
    @GetMapping("/server-status")
    public ResponseEntity<String> status() {
    	return ResponseEntity.ok("Kumo backend ---> OK");
    }
       
}

package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * A simple REST Controller for testing if the application is running properly.
 */
@RestController // Marks this class as a RESTful Controller that handles HTTP requests
public class HelloWorldController {

    /**
     * Define a GET request endpoint with path /hello
     * When users access http://localhost:8080/hello, this method will be executed
     * @return Returns a simple string message
     */
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, simple-waterball application is running successfully and connected to DB!";
    }
}
package com.example.demo.middleware;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS middleware configuration
 * Note: This is now handled by WebConfig. Keeping for backward compatibility but disabled.
 */
@Configuration
public class CorsMiddleware implements WebMvcConfigurer {
    
    // CORS configuration moved to WebConfig to support credentials
    // This class is kept for backward compatibility but no longer configures CORS
}

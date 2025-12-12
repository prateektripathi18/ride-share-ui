//src/main/java/com/carpool/config/SecurityConfig.java
package com.carpool.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtFilter jwtFilter = new JwtFilter(jwtUtil);

        http.cors(Customizer.withDefaults())
                .csrf().disable()
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/auth/**", "/h2-console/**", "/actuator/**").permitAll()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // allow frames for H2 console
        http.headers().frameOptions().sameOrigin();
        return http.build();
    }
}

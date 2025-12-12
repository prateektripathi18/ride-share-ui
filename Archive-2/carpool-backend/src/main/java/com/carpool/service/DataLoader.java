// src/main/java/com/carpool/service/DataLoader.java
package com.carpool.service;

import com.carpool.model.Ride;
import com.carpool.model.User;
import com.carpool.repository.RideRepository;
import com.carpool.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class DataLoader {
    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataLoader(UserRepository userRepository, RideRepository rideRepository){
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
    }

    @PostConstruct
    public void seed(){
        // 1. Force Update Admin Account (Fixes login issue)
        User manager = userRepository.findByEmail("admin@carpool.com").orElse(new User());
        manager.setFullname("Super Manager");
        manager.setEmail("admin@carpool.com");
        manager.setPassword(encoder.encode("admin123")); // Reset password to known value
        manager.setRole("MANAGER");
        manager.setApproved(true);
        userRepository.save(manager);
        System.out.println("Admin seeded: admin@carpool.com / admin123");

        // 2. Create Sample User if missing
        if (userRepository.findByEmail("user@carpool.com").isEmpty()){
            User u = new User();
            u.setFullname("John Doe");
            u.setEmail("user@carpool.com");
            u.setPassword(encoder.encode("user123"));
            u.setRole("USER");
            u.setApproved(true);
            userRepository.save(u);

            // 3. Host a sample ride (Fixed Constructor Order)
            Ride ride = new Ride(
                    "John Doe",             // Driver Name
                    "New York",             // From
                    "Boston",               // To
                    "2025-12-15T09:00",     // Date (ISO format or string)
                    3,                      // Seats
                    45.0,                   // Price
                    "Toyota Camry",         // Car Name
                    "AB-123-XY"             // Vehicle Num
            );
            // CRITICAL: Set the owner email so it appears in the "Hosted" tab
            ride.setOwnerEmail("user@carpool.com");
            ride.setOwnerId(u.getId());
            rideRepository.save(ride);
            System.out.println("Sample User and Ride created.");
        }
    }
}
// src/main/java/com/carpool/controller/AdminController.java
package com.carpool.controller;

import com.carpool.model.User;
import com.carpool.model.Ride;
import com.carpool.repository.UserRepository;
import com.carpool.repository.RideRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;

    public AdminController(UserRepository userRepository, RideRepository rideRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() { return userRepository.findAll(); }

    @GetMapping("/rides")
    public List<Ride> getAllRides() { return rideRepository.findAll(); }

    // FIXED: Now just approves the user without forcing them to be an "Assistant"
    // This ensures they stay as "ADMIN" (or whatever they requested) and move to the Team section
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveAdmin(@PathVariable Long id) {
        return userRepository.findById(id).map(u -> {
            u.setApproved(true);
            // Optional: If they were just "USER" but somehow got here, you could set a default.
            // But for "Request Admin" flow, they are already "ADMIN".
            userRepository.save(u);
            return ResponseEntity.ok("User approved successfully");
        }).orElse(ResponseEntity.badRequest().body("User not found"));
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    @PostMapping("/promote/{id}")
    public ResponseEntity<?> promoteUser(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newRole = payload.get("role");
        return userRepository.findById(id).map(u -> {
            u.setRole(newRole);
            // Ensure they are approved if promoted
            u.setApproved(true);
            userRepository.save(u);
            return ResponseEntity.ok("Promoted to " + newRole);
        }).orElse(ResponseEntity.badRequest().body("User not found"));
    }
}
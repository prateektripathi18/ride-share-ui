package com.carpool.controller;

import com.carpool.model.User;
import com.carpool.model.Car;
import com.carpool.repository.UserRepository;
import com.carpool.repository.CarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository userRepository;
    private final CarRepository carRepository;

    public UserController(UserRepository userRepository, CarRepository carRepository){
        this.userRepository = userRepository;
        this.carRepository = carRepository;
    }

    // --- CAR MANAGEMENT ---

    @GetMapping("/{id}/cars")
    public List<Car> getUserCars(@PathVariable Long id) {
        return carRepository.findByOwnerId(id);
    }

    @PostMapping("/{id}/cars")
    public Car addCar(@PathVariable Long id, @RequestBody Car car) {
        car.setOwnerId(id);
        return carRepository.save(car);
    }

    // --- RATING SYSTEM ---

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateUser(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        Double stars = payload.get("stars");
        if (stars == null || stars < 1 || stars > 5) {
            return ResponseEntity.badRequest().body("Invalid rating (1-5)");
        }

        return userRepository.findById(id).map(u -> {
            u.addRating(stars);
            userRepository.save(u);
            return ResponseEntity.ok("Rated successfully");
        }).orElse(ResponseEntity.badRequest().body("User not found"));
    }

    // --- EXISTING ENDPOINTS ---

    @GetMapping
    public List<User> getAll(){ return userRepository.findAll(); }

    @GetMapping("/{id}")
    public Optional<User> getOne(@PathVariable Long id){ return userRepository.findById(id); }

    @GetMapping("/me")
    public User me(HttpServletRequest request){
        String email = (String) request.getAttribute("email");
        if (email == null) return null;
        return userRepository.findByEmail(email).orElse(null);
    }
}
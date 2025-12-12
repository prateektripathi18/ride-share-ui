//src/main/java/com/carpool/controller/RideController.java
package com.carpool.controller;

import com.carpool.model.Ride;
import com.carpool.repository.RideRepository;
import com.carpool.repository.UserRepository;
import com.carpool.model.User;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RideController {
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideController(RideRepository rideRepository, UserRepository userRepository){
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Ride> listAll(@RequestParam(required = false) String from,
                              @RequestParam(required = false) String to){
        List<Ride> all = rideRepository.findAll();
        return all.stream().filter(r -> {
            boolean ok = true;
            if (from != null && !from.isBlank()) ok = r.getFromLocation().toLowerCase().contains(from.toLowerCase());
            if (ok && to != null && !to.isBlank()) ok = r.getToLocation().toLowerCase().contains(to.toLowerCase());
            return ok;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Ride create(@RequestBody Ride r){
        return rideRepository.save(r);
    }

    @GetMapping("/hosted")
    public List<Ride> hosted(HttpServletRequest request){
        String email = (String) request.getAttribute("email");
        if (email == null) return List.of();
        return rideRepository.findAll().stream()
                .filter(r -> email.equals(r.getOwnerEmail()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Ride get(@PathVariable Long id){ return rideRepository.findById(id).orElse(null); }
}

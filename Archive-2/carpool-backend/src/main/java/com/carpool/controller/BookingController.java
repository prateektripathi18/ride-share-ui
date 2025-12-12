//src/main/java/com/carpool/controller/BookingController.java
package com.carpool.controller;

import com.carpool.model.Booking;
import com.carpool.model.Ride;
import com.carpool.model.User;
import com.carpool.repository.RideRepository;
import com.carpool.repository.UserRepository;
import com.carpool.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService bookingService;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, RideRepository rideRepository, UserRepository userRepository){
        this.bookingService = bookingService;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    // create booking (request) for a ride
    @PostMapping("/request")
    public ResponseEntity<?> requestBooking(@RequestBody Booking payload, HttpServletRequest request){
        String email = (String) request.getAttribute("email");
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");
        User u = userRepository.findByEmail(email).orElse(null);
        if (u == null) return ResponseEntity.status(401).body("Unauthorized");

        Ride ride = rideRepository.findById(payload.getRideId()).orElse(null);
        if (ride == null) return ResponseEntity.badRequest().body("Ride not found");
        if (payload.getSeatsRequested() <= 0) payload.setSeatsRequested(1);
        // Save booking request
        Booking b = new Booking();
        b.setRideId(ride.getId());
        b.setRequesterId(u.getId());
        b.setRequesterName(u.getFullname());
        b.setRequesterEmail(u.getEmail());
        b.setSeatsRequested(payload.getSeatsRequested());
        b.setStatus(Booking.Status.PENDING);
        Booking saved = bookingService.create(b);
        return ResponseEntity.ok(saved);
    }

    // list bookings where current user is requester (travelled or pending)
    @GetMapping("/my")
    public List<Booking> myBookings(HttpServletRequest request){
        String email = (String) request.getAttribute("email");
        if (email == null) return List.of();
        User u = userRepository.findByEmail(email).orElse(null);
        if (u == null) return List.of();
        return bookingService.findByRequesterId(u.getId());
    }

    // list bookings for a host's rides (so hosts can see requests)
    @GetMapping("/for-host")
    public List<Booking> bookingsForHost(HttpServletRequest request){
        String email = (String) request.getAttribute("email");
        if (email == null) return List.of();
        // find rides owned by this host
        List<Ride> rides = rideRepository.findAll().stream()
                .filter(r -> email.equals(r.getOwnerEmail()))
                .toList();
        // collect booking lists for those rides
        return rides.stream()
                .flatMap(r -> bookingService.findByRideId(r.getId()).stream())
                .toList();
    }

    // host accepts or rejects a booking
    @PostMapping("/{id}/decide")
    public ResponseEntity<?> decideBooking(@PathVariable Long id, @RequestParam("action") String action, HttpServletRequest request){
        String email = (String) request.getAttribute("email");
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");
        Booking b = bookingService.findById(id).orElse(null);
        if (b == null) return ResponseEntity.badRequest().body("Booking not found");
        Ride ride = rideRepository.findById(b.getRideId()).orElse(null);
        if (ride == null) return ResponseEntity.badRequest().body("Ride not found");

        // only ride owner can decide
        if (!email.equals(ride.getOwnerEmail())) return ResponseEntity.status(403).body("Not allowed");

        if ("accept".equalsIgnoreCase(action)) {
            // reduce seats if available
            if (ride.getSeatsAvailable() < b.getSeatsRequested()) return ResponseEntity.badRequest().body("Not enough seats");
            ride.setSeatsAvailable(ride.getSeatsAvailable() - b.getSeatsRequested());
            rideRepository.save(ride);
            b.setStatus(Booking.Status.ACCEPTED);
            bookingService.save(b);
            return ResponseEntity.ok(b);
        } else if ("reject".equalsIgnoreCase(action)) {
            b.setStatus(Booking.Status.REJECTED);
            bookingService.save(b);
            return ResponseEntity.ok(b);
        } else {
            return ResponseEntity.badRequest().body("Invalid action");
        }
    }
}

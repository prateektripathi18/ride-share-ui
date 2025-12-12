//src/main/java/com/carpool/service/BookingService.java
package com.carpool.service;

import org.springframework.stereotype.Service;
import com.carpool.model.Booking;
import com.carpool.repository.BookingRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository){
        this.bookingRepository = bookingRepository;
    }

    public Booking create(Booking b) { return bookingRepository.save(b); }
    public Optional<Booking> findById(Long id) { return bookingRepository.findById(id); }
    public List<Booking> findByRequesterId(Long id) { return bookingRepository.findByRequesterId(id); }
    public List<Booking> findByRideId(Long id) { return bookingRepository.findByRideId(id); }
    public Booking save(Booking b) { return bookingRepository.save(b); }
}

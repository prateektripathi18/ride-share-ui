//src/main/java/com/carpool/repository/BookingRepository.java
package com.carpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carpool.model.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRequesterId(Long requesterId);
    List<Booking> findByRideId(Long rideId);
}

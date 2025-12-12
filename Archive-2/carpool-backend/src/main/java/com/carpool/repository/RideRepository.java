//src/main/java/com/carpool/repository/RideRepository.java
package com.carpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carpool.model.Ride;

public interface RideRepository extends JpaRepository<Ride, Long> {
}

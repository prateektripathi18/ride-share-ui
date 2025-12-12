//src/main/java/com/carpool/model/Booking.java
package com.carpool.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long rideId;
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private int seatsRequested = 1;
    private LocalDateTime requestedAt = LocalDateTime.now();

    public static enum Status { PENDING, ACCEPTED, REJECTED }

    public Booking(){}

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getRequesterEmail() { return requesterEmail; }
    public void setRequesterEmail(String requesterEmail) { this.requesterEmail = requesterEmail; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public int getSeatsRequested() { return seatsRequested; }
    public void setSeatsRequested(int seatsRequested) { this.seatsRequested = seatsRequested; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
}

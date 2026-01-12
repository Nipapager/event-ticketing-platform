package com.nipapager.eventticketingplatform.venue.controller;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.venue.dto.VenueDTO;
import com.nipapager.eventticketingplatform.venue.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for venue management
 */
@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')") // Changed from ROLE_ADMIN only
    public ResponseEntity<Response<VenueDTO>> createVenue(@RequestBody VenueDTO venueDTO) {
        Response<VenueDTO> response = venueService.createVenue(venueDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping
    public ResponseEntity<Response<List<VenueDTO>>> getAllVenues() {
        Response<List<VenueDTO>> response = venueService.getAllVenues();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<VenueDTO>> getVenueById(@PathVariable Long id) {
        Response<VenueDTO> response = venueService.getVenueById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<Response<List<VenueDTO>>> getVenuesByCity(@PathVariable String city) {
        Response<List<VenueDTO>> response = venueService.getVenuesByCity(city);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<VenueDTO>> updateVenue(
            @PathVariable Long id,
            @RequestBody VenueDTO venueDTO) {
        Response<VenueDTO> response = venueService.updateVenue(id, venueDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<Void>> deleteVenue(@PathVariable Long id) {
        Response<Void> response = venueService.deleteVenue(id);
        return ResponseEntity.ok(response);
    }
}
package com.nipapager.eventticketingplatform.venue.service;

import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.venue.dto.VenueDTO;
import com.nipapager.eventticketingplatform.venue.entity.Venue;
import com.nipapager.eventticketingplatform.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service implementation for venue operations
 * Handles business logic for venue management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final ModelMapper modelMapper;

    @Override
    public Response<VenueDTO> createVenue(VenueDTO venueDTO) {
        log.info("Creating venue: {} at {}", venueDTO.getName(), venueDTO.getAddress());

        // Check for duplicate address
        if (venueRepository.existsByAddress(venueDTO.getAddress())) {
            throw new BadRequestException("Venue already exists at this address");
        }

        // Map DTO to entity
        Venue venue = modelMapper.map(venueDTO, Venue.class);
        venue.setCreatedAt(LocalDateTime.now());

        // Save to database
        Venue savedVenue = venueRepository.save(venue);
        log.info("Venue created successfully with ID: {}", savedVenue.getId());

        // Map saved entity back to DTO
        VenueDTO savedVenueDTO = modelMapper.map(savedVenue, VenueDTO.class);

        return Response.<VenueDTO>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Venue created successfully")
                .data(savedVenueDTO)
                .build();
    }

    @Override
    public Response<List<VenueDTO>> getAllVenues() {
        log.info("Fetching all venues");

        // Get all venues from database
        List<Venue> venueList = venueRepository.findAll();

        // Map entities to DTOs
        List<VenueDTO> venueDTOList = venueList.stream()
                .map(venue -> modelMapper.map(venue, VenueDTO.class))
                .toList();

        return Response.<List<VenueDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Venues retrieved successfully")
                .data(venueDTOList)
                .build();
    }

    @Override
    public Response<VenueDTO> getVenueById(Long id) {
        log.info("Fetching venue with id: {}", id);

        // Find venue by id
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue not found with id: " + id));

        // Map to DTO
        VenueDTO venueDTO = modelMapper.map(venue, VenueDTO.class);

        return Response.<VenueDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Venue retrieved successfully")
                .data(venueDTO)
                .build();
    }

    @Override
    public Response<List<VenueDTO>> getVenuesByCity(String city) {
        log.info("Fetching venues in city: {}", city);

        // Find venues by city
        List<Venue> venueList = venueRepository.findByCity(city);

        // Map to DTOs
        List<VenueDTO> venueDTOList = venueList.stream()
                .map(venue -> modelMapper.map(venue, VenueDTO.class))
                .toList();

        return Response.<List<VenueDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Venues retrieved successfully for city: " + city)
                .data(venueDTOList)
                .build();
    }

    @Override
    public Response<VenueDTO> updateVenue(Long id, VenueDTO venueDTO) {
        log.info("Updating venue with id: {}", id);

        // Find existing venue
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue not found with id: " + id));

        // Update name if provided (no duplicate check needed)
        if (venueDTO.getName() != null && !venueDTO.getName().isEmpty()) {
            venue.setName(venueDTO.getName());
        }

        // Update address if provided (check for duplicate)
        if (venueDTO.getAddress() != null && !venueDTO.getAddress().isEmpty()) {
            // Only check if address is being changed
            if (!venue.getAddress().equals(venueDTO.getAddress()) &&
                    venueRepository.existsByAddress(venueDTO.getAddress())) {
                throw new BadRequestException("Venue already exists at this address");
            }
            venue.setAddress(venueDTO.getAddress());
        }

        // Update city if provided
        if (venueDTO.getCity() != null && !venueDTO.getCity().isEmpty()) {
            venue.setCity(venueDTO.getCity());
        }

        // Update capacity if provided
        if (venueDTO.getCapacity() != null) {
            venue.setCapacity(venueDTO.getCapacity());
        }

        // Update description if provided
        if (venueDTO.getDescription() != null && !venueDTO.getDescription().isEmpty()) {
            venue.setDescription(venueDTO.getDescription());
        }

        // Update image URL if provided
        if (venueDTO.getImageUrl() != null && !venueDTO.getImageUrl().isEmpty()) {
            venue.setImageUrl(venueDTO.getImageUrl());
        }

        // Update map coordinates if provided
        if (venueDTO.getMapCoordinates() != null && !venueDTO.getMapCoordinates().isEmpty()) {
            venue.setMapCoordinates(venueDTO.getMapCoordinates());
        }

        // Set updated timestamp
        venue.setUpdatedAt(LocalDateTime.now());

        // Save updated venue
        Venue savedVenue = venueRepository.save(venue);
        log.info("Venue updated successfully: {}", savedVenue.getId());

        // Map to DTO
        VenueDTO savedVenueDTO = modelMapper.map(savedVenue, VenueDTO.class);

        return Response.<VenueDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Venue updated successfully")
                .data(savedVenueDTO)
                .build();
    }

    @Override
    public Response<Void> deleteVenue(Long id) {
        log.info("Deleting venue with id: {}", id);

        // Check if venue exists
        if (!venueRepository.existsById(id)) {
            throw new NotFoundException("Venue not found with id: " + id);
        }

        // Delete venue
        venueRepository.deleteById(id);
        log.info("Venue deleted successfully: {}", id);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Venue deleted successfully")
                .build();
    }
}
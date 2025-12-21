package com.nipapager.eventticketingplatform.venue.service;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.venue.dto.VenueDTO;

import java.util.List;

/**
 * Service interface for venue operations
 */
public interface VenueService {

    Response<VenueDTO> createVenue(VenueDTO venueDTO);

    Response<List<VenueDTO>> getAllVenues();

    Response<VenueDTO> getVenueById(Long id);

    Response<List<VenueDTO>> getVenuesByCity(String city);

    Response<VenueDTO> updateVenue(Long id, VenueDTO venueDTO);

    Response<Void> deleteVenue(Long id);
}
package com.nipapager.eventticketingplatform.venue.service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Service for geocoding addresses to coordinates using Nominatim (OpenStreetMap)
 */
@Service
@Slf4j
public class GeocodingService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private final RestTemplate restTemplate;

    public GeocodingService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Convert address to coordinates
     * @param address Full address (e.g., "Aristotelous 10, Thessaloniki, Greece")
     * @return GeocodingResult with latitude and longitude, or null if not found
     */
    public GeocodingResult geocode(String address) {
        try {
            log.info("Geocoding address: {}", address);

            // Build URL with parameters
            String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                    .queryParam("q", address)
                    .queryParam("format", "json")
                    .queryParam("limit", "1")
                    .queryParam("addressdetails", "1")
                    .toUriString();

            // Make request to Nominatim
            NominatimResponse[] responses = restTemplate.getForObject(url, NominatimResponse[].class);

            // Check if we got results
            if (responses != null && responses.length > 0) {
                NominatimResponse response = responses[0];

                double lat = Double.parseDouble(response.getLat());
                double lon = Double.parseDouble(response.getLon());

                log.info("Geocoding successful: {} -> ({}, {})", address, lat, lon);

                return new GeocodingResult(lat, lon);
            }

            log.warn("No geocoding results found for address: {}", address);
            return null;

        } catch (Exception e) {
            log.error("Geocoding failed for address: {}", address, e);
            return null;
        }
    }

    /**
     * Nominatim API response structure
     */
    @Data
    private static class NominatimResponse {
        private String lat;
        private String lon;
        private String display_name;
    }

    /**
     * Result object containing coordinates
     */
    @Data
    public static class GeocodingResult {
        private final double latitude;
        private final double longitude;
    }
}
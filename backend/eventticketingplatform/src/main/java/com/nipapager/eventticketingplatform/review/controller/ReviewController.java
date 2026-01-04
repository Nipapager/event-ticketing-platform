package com.nipapager.eventticketingplatform.review.controller;

import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.review.dto.ReviewDTO;
import com.nipapager.eventticketingplatform.review.dto.ReviewSummaryDTO;
import com.nipapager.eventticketingplatform.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for review management
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Response<ReviewDTO>> createReview(@RequestBody ReviewDTO reviewDTO) {
        Response<ReviewDTO> response = reviewService.createReview(reviewDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Response<List<ReviewDTO>>> getReviewsByEventId(@PathVariable Long eventId) {
        Response<List<ReviewDTO>> response = reviewService.getReviewsByEventId(eventId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<ReviewDTO>> getReviewById(@PathVariable Long id) {
        Response<ReviewDTO> response = reviewService.getReviewById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<ReviewDTO>> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewDTO reviewDTO) {
        Response<ReviewDTO> response = reviewService.updateReview(id, reviewDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deleteReview(@PathVariable Long id) {
        Response<Void> response = reviewService.deleteReview(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<Response<List<ReviewDTO>>> getMyReviews() {
        Response<List<ReviewDTO>> response = reviewService.getMyReviews();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}/summary")
    public ResponseEntity<Response<ReviewSummaryDTO>> getReviewSummary(@PathVariable Long eventId) {
        Response<ReviewSummaryDTO> response = reviewService.getReviewSummary(eventId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}/my-review")
    public ResponseEntity<Response<ReviewDTO>> getUserReviewForEvent(@PathVariable Long eventId) {
        Response<ReviewDTO> response = reviewService.getUserReviewForEvent(eventId);
        return ResponseEntity.ok(response);
    }
}
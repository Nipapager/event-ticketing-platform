package com.nipapager.eventticketingplatform.review.service;

import com.nipapager.eventticketingplatform.enums.OrderStatus;
import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.event.entity.Event;
import com.nipapager.eventticketingplatform.event.repository.EventRepository;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.ForbiddenException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.order.repository.OrderRepository;
import com.nipapager.eventticketingplatform.response.Response;
import com.nipapager.eventticketingplatform.review.dto.ReviewDTO;
import com.nipapager.eventticketingplatform.review.dto.ReviewSummaryDTO;
import com.nipapager.eventticketingplatform.review.entity.Review;
import com.nipapager.eventticketingplatform.review.repository.ReviewRepository;
import com.nipapager.eventticketingplatform.user.entity.User;
import com.nipapager.eventticketingplatform.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for review operations
 * Handles business logic for event reviews
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    public Response<ReviewDTO> createReview(ReviewDTO reviewDTO) {
        log.info("Creating review for event: {}", reviewDTO.getEventId());

        // Get current user
        User user = userService.getCurrentLoggedInUser();

        // Find event
        Event event = eventRepository.findById(reviewDTO.getEventId())
                .orElseThrow(() -> new NotFoundException("Event not found"));

        // Validate user can review
        validateCanReview(user, event);

        // Validate rating
        if (reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        // Create review
        Review review = Review.builder()
                .user(user)
                .event(event)
                .rating(reviewDTO.getRating())
                .comment(reviewDTO.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        // Save review
        Review savedReview = reviewRepository.save(review);
        log.info("Review created successfully with ID: {}", savedReview.getId());

        // Map to DTO
        ReviewDTO savedDTO = mapToDTO(savedReview);

        return Response.<ReviewDTO>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Review created successfully")
                .data(savedDTO)
                .build();
    }

    @Override
    public Response<List<ReviewDTO>> getReviewsByEventId(Long eventId) {
        log.info("Fetching reviews for event: {}", eventId);

        // Validate event exists
        if (!eventRepository.existsById(eventId)) {
            throw new NotFoundException("Event not found");
        }

        // Get reviews
        List<Review> reviews = reviewRepository.findByEventId(eventId);

        // Map to DTOs
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return Response.<List<ReviewDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Reviews retrieved successfully")
                .data(reviewDTOs)
                .build();
    }

    @Override
    public Response<ReviewDTO> getReviewById(Long id) {
        log.info("Fetching review with id: {}", id);

        // Find review
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review not found"));

        // Map to DTO
        ReviewDTO reviewDTO = mapToDTO(review);

        return Response.<ReviewDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Review retrieved successfully")
                .data(reviewDTO)
                .build();
    }

    @Override
    public Response<ReviewDTO> updateReview(Long id, ReviewDTO reviewDTO) {
        log.info("Updating review with id: {}", id);

        // Find review
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review not found"));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only update your own reviews");
        }

        // Update rating if provided
        if (reviewDTO.getRating() != null) {
            if (reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5) {
                throw new BadRequestException("Rating must be between 1 and 5");
            }
            review.setRating(reviewDTO.getRating());
        }

        // Update comment if provided
        if (reviewDTO.getComment() != null) {
            review.setComment(reviewDTO.getComment());
        }

        review.setUpdatedAt(LocalDateTime.now());

        // Save updated review
        Review savedReview = reviewRepository.save(review);
        log.info("Review updated successfully: {}", savedReview.getId());

        // Map to DTO
        ReviewDTO updatedDTO = mapToDTO(savedReview);

        return Response.<ReviewDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Review updated successfully")
                .data(updatedDTO)
                .build();
    }

    @Override
    public Response<Void> deleteReview(Long id) {
        log.info("Deleting review with id: {}", id);

        // Find review
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review not found"));

        // Authorization check
        User currentUser = userService.getCurrentLoggedInUser();
        boolean isOwner = review.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == UserRole.ROLE_ADMIN);

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You don't have permission to delete this review");
        }

        // Delete review
        reviewRepository.deleteById(id);
        log.info("Review deleted successfully: {}", id);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Review deleted successfully")
                .build();
    }

    @Override
    public Response<List<ReviewDTO>> getMyReviews() {
        log.info("Fetching reviews for current user");

        // Get current user
        User user = userService.getCurrentLoggedInUser();

        // Find reviews by user
        List<Review> reviews = reviewRepository.findByUserId(user.getId());

        // Map to DTOs
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return Response.<List<ReviewDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Your reviews retrieved successfully")
                .data(reviewDTOs)
                .build();
    }

    // ========== HELPER METHODS ==========

    /**
     * Map Review entity to ReviewDTO
     */
    private ReviewDTO mapToDTO(Review review) {
        ReviewDTO dto = modelMapper.map(review, ReviewDTO.class);

        // Set relationship fields
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getName());
        dto.setEventId(review.getEvent().getId());
        dto.setEventName(review.getEvent().getTitle());

        return dto;
    }

    /**
     * Validate user can review this event
     */
    private void validateCanReview(User user, Event event) {
        // Check if already reviewed
        if (reviewRepository.existsByUserIdAndEventId(user.getId(), event.getId())) {
            throw new BadRequestException("You have already reviewed this event");
        }

        // Check if event has happened
        if (event.getEventDate().isAfter(LocalDate.now())) {
            throw new BadRequestException("Cannot review event that hasn't happened yet");
        }

        // Check if user has completed order for this event
        boolean hasCompletedOrder = orderRepository.findByUserIdAndStatus(user.getId(), OrderStatus.COMPLETED)
                .stream()
                .anyMatch(order -> order.getEvent().getId().equals(event.getId()));

        if (!hasCompletedOrder) {
            throw new BadRequestException("You must attend the event to leave a review");
        }
    }

    @Override
    public Response<ReviewSummaryDTO> getReviewSummary(Long eventId) {
        log.info("Fetching review summary for event: {}", eventId);

        // Validate event exists
        if (!eventRepository.existsById(eventId)) {
            throw new NotFoundException("Event not found");
        }

        Double averageRating = reviewRepository.getAverageRatingForEvent(eventId);
        Long totalReviews = reviewRepository.getReviewCountForEvent(eventId);

        ReviewSummaryDTO summary = new ReviewSummaryDTO();
        summary.setAverageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);
        summary.setTotalReviews(totalReviews != null ? totalReviews : 0L);

        return Response.<ReviewSummaryDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Review summary retrieved successfully")
                .data(summary)
                .build();
    }

    @Override
    public Response<ReviewDTO> getUserReviewForEvent(Long eventId) {
        log.info("Fetching current user's review for event: {}", eventId);

        User user = userService.getCurrentLoggedInUser();

        Optional<Review> review = reviewRepository.findByUserIdAndEventId(user.getId(), eventId);

        if (review.isEmpty()) {
            return Response.<ReviewDTO>builder()
                    .statusCode(HttpStatus.OK.value())
                    .message("No review found")
                    .data(null)
                    .build();
        }

        ReviewDTO reviewDTO = mapToDTO(review.get());

        return Response.<ReviewDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Review retrieved successfully")
                .data(reviewDTO)
                .build();
    }
}
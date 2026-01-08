package com.nipapager.eventticketingplatform.notification.service;

import com.nipapager.eventticketingplatform.enums.NotificationStatus;
import com.nipapager.eventticketingplatform.enums.NotificationType;
import com.nipapager.eventticketingplatform.event.entity.Event;
import com.nipapager.eventticketingplatform.notification.entity.Notification;
import com.nipapager.eventticketingplatform.notification.repository.NotificationRepository;
import com.nipapager.eventticketingplatform.order.entity.Order;
import com.nipapager.eventticketingplatform.order.entity.OrderItem;
import com.nipapager.eventticketingplatform.user.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;
    private final NotificationRepository notificationRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name}")
    private String appName;

    @Value("${app.url}")
    private String appUrl;

    @Value("${app.support.email}")
    private String supportEmail;

    @Override
    @Async
    public void sendWelcomeEmail(User user) {
        try {
            String subject = "Welcome to " + appName + "! 🎉";
            String content = buildWelcomeEmailContent(user);
            sendHtmlEmail(user.getEmail(), subject, content);

            saveNotification(user, "Welcome email sent", NotificationType.WELCOME);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
            saveFailedNotification(user, "Welcome email failed", NotificationType.WELCOME);
        }
    }

    @Override
    @Async
    public void sendOrganizerUpgradeEmail(User user) {
        try {
            String subject = "You're Now an Event Organizer! 🎊";
            String content = buildOrganizerUpgradeEmailContent(user);
            sendHtmlEmail(user.getEmail(), subject, content);

            saveNotification(user, "Organizer upgrade email sent", NotificationType.ACCOUNT_UPDATE);
            log.info("Organizer upgrade email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send organizer upgrade email to: {}", user.getEmail(), e);
            saveFailedNotification(user, "Organizer upgrade email failed", NotificationType.ACCOUNT_UPDATE);
        }
    }

    @Override
    @Async
    public void sendTicketPurchaseEmail(Order order) {
        try {
            String subject = "Your Tickets for " + order.getEvent().getTitle() + " 🎟️";
            String content = buildTicketPurchaseEmailContent(order);

            // Send email with QR code attachments
            sendHtmlEmailWithQRCodes(order.getUser().getEmail(), subject, content, order);

            saveNotification(order.getUser(),
                    "Ticket purchase confirmation for " + order.getEvent().getTitle(),
                    NotificationType.BOOKING_CONFIRMATION);
            log.info("Ticket purchase email sent to: {}", order.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send ticket purchase email for order: {}", order.getId(), e);
            saveFailedNotification(order.getUser(),
                    "Ticket purchase email failed for order #" + order.getId(),
                    NotificationType.BOOKING_CONFIRMATION);
        }
    }

    @Override
    @Async
    public void sendRefundEmail(Order order) {
        try {
            String subject = "Refund Processed - " + order.getEvent().getTitle();
            String content = buildRefundEmailContent(order);
            sendHtmlEmail(order.getUser().getEmail(), subject, content);

            saveNotification(order.getUser(),
                    "Refund processed for " + order.getEvent().getTitle(),
                    NotificationType.REFUND);
            log.info("Refund email sent to: {}", order.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send refund email for order: {}", order.getId(), e);
            saveFailedNotification(order.getUser(),
                    "Refund email failed for order #" + order.getId(),
                    NotificationType.REFUND);
        }
    }

    @Override
    @Async
    public void sendEventCreatedEmail(Event event) {
        try {
            String subject = "Event Submitted for Approval - " + event.getTitle();
            String content = buildEventCreatedEmailContent(event);
            sendHtmlEmail(event.getOrganizer().getEmail(), subject, content);

            saveNotification(event.getOrganizer(),
                    "Event created: " + event.getTitle() + " - Pending approval",
                    NotificationType.EVENT_UPDATE);
            log.info("Event created email sent to: {}", event.getOrganizer().getEmail());
        } catch (Exception e) {
            log.error("Failed to send event created email for event: {}", event.getId(), e);
            saveFailedNotification(event.getOrganizer(),
                    "Event created email failed for event: " + event.getTitle(),
                    NotificationType.EVENT_UPDATE);
        }
    }

    @Override
    @Async
    public void sendEventApprovedEmail(Event event) {
        try {
            String subject = "Event Approved! " + event.getTitle() + " ✅";
            String content = buildEventApprovedEmailContent(event);
            sendHtmlEmail(event.getOrganizer().getEmail(), subject, content);

            saveNotification(event.getOrganizer(),
                    "Event approved: " + event.getTitle(),
                    NotificationType.EVENT_UPDATE);
            log.info("Event approved email sent to: {}", event.getOrganizer().getEmail());
        } catch (Exception e) {
            log.error("Failed to send event approved email for event: {}", event.getId(), e);
            saveFailedNotification(event.getOrganizer(),
                    "Event approved email failed for event: " + event.getTitle(),
                    NotificationType.EVENT_UPDATE);
        }
    }

    // ========== HELPER METHODS ==========

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private void sendHtmlEmailWithQRCodes(String to, String subject, String htmlContent, Order order) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        // Attach QR codes as inline images
        int qrIndex = 0;
        for (OrderItem item : order.getOrderItems()) {
            if (item.getQrCodeUrl() != null && !item.getQrCodeUrl().isEmpty()) {
                try {
                    // Extract Base64 data (remove "data:image/png;base64," prefix if exists)
                    String base64Data = item.getQrCodeUrl();
                    if (base64Data.startsWith("data:image")) {
                        base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
                    }

                    // Decode Base64 to bytes
                    byte[] qrCodeBytes = java.util.Base64.getDecoder().decode(base64Data);

                    // Create ByteArrayResource
                    ByteArrayResource qrResource = new ByteArrayResource(qrCodeBytes);

                    // Add as inline attachment with Content-ID
                    String contentId = "qrcode-" + qrIndex;
                    helper.addInline(contentId, qrResource, "image/png");

                    qrIndex++;
                } catch (Exception e) {
                    log.error("Failed to attach QR code for item {}: {}", item.getId(), e.getMessage());
                }
            }
        }

        mailSender.send(message);
    }

    private void saveNotification(User user, String message, NotificationType type) {
        try {
            Notification notification = Notification.builder()
                    .user(user)
                    .message(message)
                    .type(type)
                    .status(NotificationStatus.SENT)
                    .sentAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Failed to save notification record", e);
        }
    }

    private void saveFailedNotification(User user, String message, NotificationType type) {
        try {
            Notification notification = Notification.builder()
                    .user(user)
                    .message(message)
                    .type(type)
                    .status(NotificationStatus.FAILED)
                    .build();

            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Failed to save failed notification record", e);
        }
    }

    // ========== EMAIL CONTENT BUILDERS ==========

    private String buildWelcomeEmailContent(User user) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; padding: 0; }
                .header { background: #3b82f6; color: white; padding: 40px 30px; text-align: center; }
                .content { background: white; padding: 40px 30px; }
                .button { display: inline-block; padding: 14px 28px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">Welcome to %s</h1>
                </div>
                <div class="content">
                    <p>Hi %s,</p>
                    <p>Thanks for signing up! Your account is ready to go.</p>
                    <p>You can now browse events, book tickets, and manage your bookings all in one place.</p>
                    <a href="%s/events" class="button">Browse Events</a>
                    <p>Need help? Just reply to this email.</p>
                    <p>— The %s Team</p>
                </div>
                <div class="footer">
                    <p>%s | <a href="mailto:%s" style="color: #3b82f6;">%s</a></p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(appName, user.getName(), appUrl, appName, appName, supportEmail, supportEmail);
    }

    private String buildOrganizerUpgradeEmailContent(User user) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; padding: 0; }
                .header { background: #8b5cf6; color: white; padding: 40px 30px; text-align: center; }
                .content { background: white; padding: 40px 30px; }
                .button { display: inline-block; padding: 14px 28px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">You're Now an Organizer</h1>
                </div>
                <div class="content">
                    <p>Hi %s,</p>
                    <p>Good news! Your account has been upgraded to Organizer status.</p>
                    <p>You can now create events, manage ticket sales, and reach a wider audience.</p>
                    <a href="%s/create-event" class="button">Create Your First Event</a>
                    <p>Looking forward to seeing what you create.</p>
                    <p>— The %s Team</p>
                </div>
                <div class="footer">
                    <p>%s | <a href="mailto:%s" style="color: #8b5cf6;">%s</a></p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(user.getName(), appUrl, appName, appName, supportEmail, supportEmail);
    }

    private String buildTicketPurchaseEmailContent(Order order) {
        StringBuilder ticketsHtml = new StringBuilder();
        int qrIndex = 0;

        for (OrderItem item : order.getOrderItems()) {
            String qrImageSrc = item.getQrCodeUrl() != null ? "cid:qrcode-" + qrIndex : "";

            ticketsHtml.append("""
        <div style="background: #f9fafb; padding: 20px; margin: 16px 0; border-radius: 8px; border-left: 3px solid #10b981;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 600; font-size: 16px;">%s</p>
                    <p style="margin: 8px 0 0 0; color: #6b7280;">%d ticket%s × €%.2f</p>
                    <p style="margin: 8px 0 0 0; color: #6b7280; font-family: monospace; font-size: 14px;">Code: %s</p>
                </div>
                %s
            </div>
        </div>
        """.formatted(
                    item.getTicketType().getName(),
                    item.getQuantity(),
                    item.getQuantity() > 1 ? "s" : "",
                    item.getPricePerTicket(),
                    item.getTicketCode() != null ? item.getTicketCode() : "Pending",
                    !qrImageSrc.isEmpty()
                            ? "<div style=\"margin-left: 20px;\"><img src=\"" + qrImageSrc + "\" alt=\"QR Code\" style=\"width: 120px; height: 120px; border: 2px solid #e5e7eb; border-radius: 8px;\" /></div>"
                            : ""
            ));

            qrIndex++;
        }

        return """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; padding: 0; }
            .header { background: #10b981; color: white; padding: 40px 30px; text-align: center; }
            .content { background: white; padding: 40px 30px; }
            .button { display: inline-block; padding: 14px 28px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .total { background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .info-box { background: #dbeafe; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Booking Confirmed</h1>
            </div>
            <div class="content">
                <p>Hi %s,</p>
                <p>Your tickets for <strong>%s</strong> are ready.</p>
                
                <p style="margin-top: 24px;"><strong>Event Details</strong></p>
                <p style="margin: 8px 0; color: #6b7280;">%s<br>%s</p>
                
                <p style="margin-top: 24px;"><strong>Your Tickets</strong></p>
                %s
                
                <div class="total">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Total Paid</p>
                    <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: bold; color: #1f2937;">€%.2f</p>
                </div>
                
                <div class="info-box">
                    <p style="margin: 0; font-weight: 600; color: #1e40af;">Important: Show Your QR Code</p>
                    <p style="margin: 8px 0 0 0; color: #1e40af;">Present your QR code at the entrance for quick check-in. You can also find your tickets in your account.</p>
                </div>
                
                <a href="%s/my-tickets" class="button">View All Tickets</a>
                
                <p>See you there!</p>
                <p>— The %s Team</p>
            </div>
            <div class="footer">
                <p>Order #%d | %s</p>
            </div>
        </div>
    </body>
    </html>
    """.formatted(
                order.getUser().getName(),
                order.getEvent().getTitle(),
                order.getEvent().getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy")),
                order.getEvent().getVenue().getName(),
                ticketsHtml.toString(),
                order.getTotalAmount(),
                appUrl,
                appName,
                order.getId(),
                appName
        );
    }

    private String buildRefundEmailContent(Order order) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; padding: 0; }
                .header { background: #f59e0b; color: white; padding: 40px 30px; text-align: center; }
                .content { background: white; padding: 40px 30px; }
                .refund-box { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">Refund Processed</h1>
                </div>
                <div class="content">
                    <p>Hi %s,</p>
                    <p>Your refund for <strong>%s</strong> has been processed.</p>
                    
                    <div class="refund-box">
                        <p style="margin: 0; font-size: 14px; color: #92400e;">Refund Amount</p>
                        <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #92400e;">€%.2f</p>
                    </div>
                    
                    <p>The money should appear in your account within 5-10 business days.</p>
                    <p>Your tickets have been cancelled and won't work at the venue.</p>
                    
                    <p>Questions? Just reply to this email.</p>
                    <p>— The %s Team</p>
                </div>
                <div class="footer">
                    <p>Order #%d | %s</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
                order.getUser().getName(),
                order.getEvent().getTitle(),
                order.getTotalAmount(),
                appName,
                order.getId(),
                appName
        );
    }

    private String buildEventCreatedEmailContent(Event event) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; padding: 0; }
                .header { background: #6366f1; color: white; padding: 40px 30px; text-align: center; }
                .content { background: white; padding: 40px 30px; }
                .status-box { background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">Event Submitted</h1>
                </div>
                <div class="content">
                    <p>Hi %s,</p>
                    <p>We received your event submission for <strong>%s</strong>.</p>
                    
                    <div class="status-box">
                        <p style="margin: 0; font-weight: 600; color: #92400e;">Status: Pending Review</p>
                    </div>
                    
                    <p>Our team will review it and get back to you soon. We'll email you once it's approved.</p>
                    
                    <p style="margin-top: 24px; color: #6b7280;">Event: %s<br>Date: %s<br>Venue: %s</p>
                    
                    <p>Thanks for using %s!</p>
                    <p>— The %s Team</p>
                </div>
                <div class="footer">
                    <p>%s | <a href="mailto:%s" style="color: #6366f1;">%s</a></p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
                event.getOrganizer().getName(),
                event.getTitle(),
                event.getCategory().getName(),
                event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy")),
                event.getVenue().getName(),
                appName,
                appName,
                appName,
                supportEmail,
                supportEmail
        );
    }

    private String buildEventApprovedEmailContent(Event event) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; padding: 0; }
                .header { background: #10b981; color: white; padding: 40px 30px; text-align: center; }
                .content { background: white; padding: 40px 30px; }
                .button { display: inline-block; padding: 14px 28px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .success-box { background: #d1fae5; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">Event Approved!</h1>
                </div>
                <div class="content">
                    <p>Hi %s,</p>
                    <p>Great news! Your event <strong>%s</strong> is now live.</p>
                    
                    <div class="success-box">
                        <p style="margin: 0; font-weight: 600; color: #065f46;">Status: Live & Ready for Bookings</p>
                    </div>
                    
                    <p>People can now find your event and book tickets.</p>
                    
                    <a href="%s/events/%d" class="button">View Event</a>
                    
                    <p>Good luck with your event!</p>
                    <p>— The %s Team</p>
                </div>
                <div class="footer">
                    <p>%s | <a href="mailto:%s" style="color: #10b981;">%s</a></p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(
                event.getOrganizer().getName(),
                event.getTitle(),
                appUrl,
                event.getId(),
                appName,
                appName,
                supportEmail,
                supportEmail
        );
    }
}
package com.nipapager.eventticketingplatform.qrcode.service;

/**
 * Service interface for QR code generation
 */
public interface QRCodeService {

    /**
     * Generate QR code as Base64 string
     * @param data Data to encode in QR code
     * @return Base64 encoded QR code image (data:image/png;base64,...)
     */
    String generateQRCodeBase64(String data);

    /**
     * Generate unique ticket code
     * @param orderId Order ID
     * @param orderItemId Order item ID
     * @return Unique ticket code (format: EVT-{orderId}-{itemId}-{random})
     */
    String generateTicketCode(Long orderId, Long orderItemId);
}
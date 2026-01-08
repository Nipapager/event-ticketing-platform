package com.nipapager.eventticketingplatform.qrcode.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
@Slf4j
public class QRCodeServiceImpl implements QRCodeService {

    private static final int QR_CODE_SIZE = 300; // pixels

    @Override
    public String generateQRCodeBase64(String data) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] qrCodeBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(qrCodeBytes);

            return "data:image/png;base64," + base64Image;

        } catch (WriterException | IOException e) {
            log.error("Failed to generate QR code", e);
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    @Override
    public String generateTicketCode(Long orderId, Long orderItemId) {
        // Format: EVT-ORDER{orderId}-ITEM{orderItemId}-{random}
        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return String.format("EVT-%d-%d-%s", orderId, orderItemId, randomPart);
    }
}
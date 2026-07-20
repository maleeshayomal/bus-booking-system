const QRCode = require("qrcode");

/**
 * Generates a QR code (as a base64 data URL) encoding the booking reference,
 * so conductors can scan the ticket at boarding.
 */
const generateBookingQR = async (bookingData) => {
  const payload = JSON.stringify({
    ref: bookingData.reference,
    name: bookingData.passengerName,
    date: bookingData.travelDate,
    seats: bookingData.seats,
  });

  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 300,
  });

  return dataUrl;
};

module.exports = { generateBookingQR };

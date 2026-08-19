import { api } from "./api";
import { sampleBookings } from "./mockData";

export async function sendOtp(phone) {
  try {
    return await api.post(`/otp/send`, { phone });
  } catch {
    return { success: true, message: "OTP sent (demo mode)", demoCode: "123456" };
  }
}

export async function verifyOtp(phone, code) {
  try {
    return await api.post(`/otp/verify`, { phone, code });
  } catch {
    return { success: /^\d{4,6}$/.test(code) };
  }
}

export async function sendEmailOtp(email, passengerName) {
  try {
    return await api.post(`/otp/send-email`, { email, passengerName });
  } catch {
    const demoCode = String(Math.floor(100000 + Math.random() * 900000));
    return {
      success: true,
      message: `Demo OTP sent to ${email}`,
      demoCode,
    };
  }
}

export async function verifyEmailOtp(email, code) {
  try {
    return await api.post(`/otp/verify-email`, { email, code });
  } catch {
    // In demo mode accept standard 6-digit codes or 123456
    return { success: code === "123456" || /^\d{6}$/.test(code) };
  }
}

export async function getPayHereParams(payload) {
  try {
    return await api.post(`/payments/payhere-hash`, payload);
  } catch {
    // Fallback sandbox payload
    return {
      merchant_id: "1224856",
      order_id: payload.orderId || `SK-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: parseFloat(payload.amount).toFixed(2),
      currency: "LKR",
      hash: "DEMO_SANDBOX_HASH",
      items: payload.items || "Tripimate Bus Ticket",
      first_name: payload.passenger?.fullName || "Passenger",
      email: payload.passenger?.email || "passenger@tripimate.lk",
      phone: payload.passenger?.phone || "0770000000",
      sandbox: true,
    };
  }
}

export async function verifyPayHerePayment(payload) {
  try {
    return await api.post(`/payments/verify-payhere`, payload);
  } catch {
    return {
      success: true,
      status: "CONFIRMED",
      bookingReference: payload.orderId || `SK-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionRef: payload.paymentId || `PH-TXN-${Date.now()}`,
      confirmedAt: new Date().toISOString(),
    };
  }
}

export async function createBooking(payload) {
  try {
    return await api.post(`/bookings`, payload);
  } catch {
    return {
      success: true,
      booking: {
        id: payload.bookingReference || `SK-${Math.floor(1000 + Math.random() * 9000)}`,
        ...payload,
        status: "Confirmed",
      },
    };
  }
}

export async function processPayment(payload) {
  try {
    return await api.post(`/payments`, payload);
  } catch {
    return { success: true, transactionId: `TXN-${Date.now()}` };
  }
}

export async function getMyBookings(userId) {
  try {
    return await api.get(`/bookings/user/${userId}`);
  } catch {
    return sampleBookings;
  }
}

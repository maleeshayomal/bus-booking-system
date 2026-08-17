import { api } from "./api";
import { sampleBookings } from "./mockData";

export async function sendOtp(phone) {
  try {
    return await api.post(`/otp/send`, { phone });
  } catch {
    // Demo mode: pretend OTP was sent
    return { success: true, message: "OTP sent (demo mode)" };
  }
}

export async function verifyOtp(phone, code) {
  try {
    return await api.post(`/otp/verify`, { phone, code });
  } catch {
    // Demo mode: any 4-6 digit code is accepted
    return { success: /^\d{4,6}$/.test(code) };
  }
}

export async function createBooking(payload) {
  try {
    return await api.post(`/bookings`, payload);
  } catch {
    return {
      success: true,
      booking: {
        id: `SK-${Math.floor(1000 + Math.random() * 9000)}`,
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

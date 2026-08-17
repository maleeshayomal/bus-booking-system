import { api } from "./api";
import { buses } from "./mockData";

export async function searchBuses({ from, to, date }) {
  try {
    const query = new URLSearchParams({ origin: from, destination: to, date }).toString();
    return await api.get(`/bookings/search?${query}`);
  } catch {
    // Backend not reachable - use mock data for demo purposes
    return buses.filter((b) =>
      (!from || b.from === from) && (!to || b.to === to)
    );
  }
}

export async function getBusById(id) {
  try {
    return await api.get(`/buses/${id}`);
  } catch {
    return buses.find((b) => b.id === id) || buses[0];
  }
}

export async function getPopularRoutes() {
  try {
    return await api.get(`/buses`);
  } catch {
    return buses;
  }
}

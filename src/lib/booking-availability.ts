import { store } from "./db/store";
import { bookingsRepo, holdsRepo } from "./db";
import type { Service } from "@/types";

export interface Slot {
  start_at: string;
  end_at: string;
  status: "available" | "booked" | "held";
}

export function getAvailableSlots(
  providerId: string,
  service: Service,
  dateIso: string, // YYYY-MM-DD
  requestingUserId?: string,
): Slot[] {
  const [year, month, day] = dateIso.split("-").map(Number);
  if (!year || !month || !day) return [];

  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();

  const rules = store.availability_rules.filter(
    (r) => r.provider_id === providerId && r.day_of_week === dayOfWeek && r.is_active,
  );
  if (rules.length === 0) return [];

  const slots: Slot[] = [];
  const slotDurationMs = service.duration_minutes * 60_000;
  const bufferMs = service.buffer_after_minutes * 60_000;
  const now = Date.now();

  for (const rule of rules) {
    const [startH, startM] = rule.start_time.split(":").map(Number) as [number, number];
    const [endH, endM] = rule.end_time.split(":").map(Number) as [number, number];

    const windowStart = new Date(year, month - 1, day, startH, startM).getTime();
    const windowEnd = new Date(year, month - 1, day, endH, endM).getTime();

    let cursor = windowStart;
    while (cursor + slotDurationMs <= windowEnd) {
      const slotStart = new Date(cursor).toISOString();
      const slotEnd = new Date(cursor + slotDurationMs).toISOString();

      // Skip past slots (with 30min buffer to allow for "right now" bookings)
      if (cursor + slotDurationMs < now + 30 * 60_000) {
        cursor += slotDurationMs + bufferMs;
        continue;
      }

      const isBooked = bookingsRepo.isSlotTaken(providerId, slotStart, slotEnd);
      const isHeld = !isBooked && holdsRepo.isHeld(providerId, slotStart, requestingUserId);

      slots.push({
        start_at: slotStart,
        end_at: slotEnd,
        status: isBooked ? "booked" : isHeld ? "held" : "available",
      });

      cursor += slotDurationMs + bufferMs;
    }
  }

  return slots;
}

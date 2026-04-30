import { useNavigate, useParams } from "@tanstack/react-router";
import { addDays, format, isBefore, startOfToday } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { getTutorById } from "../data/mockTutors";
import { useAppStore } from "../store/useAppStore";
import type { Booking } from "../types";

const BOOKED_SLOTS = new Set(["10:00 AM", "3:00 PM"]);

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

function generateDays(count = 7) {
  const today = startOfToday();
  return Array.from({ length: count }, (_, i) => addDays(today, i));
}

export default function BookingPage() {
  const params = useParams({ strict: false }) as { tutorId?: string };
  const tutorId = params.tutorId ?? "";
  const navigate = useNavigate();
  const addBooking = useAppStore((s) => s.addBooking);

  const tutor = getTutorById(tutorId);
  const days = generateDays(7);
  const today = startOfToday();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const canConfirm = selectedDate !== null && selectedTime !== null;

  function handleConfirm() {
    if (!tutor || !selectedDate || !selectedTime) return;
    const booking: Booking = {
      id: `b-${Date.now()}`,
      tutorId: tutor.id,
      tutorName: tutor.name,
      date: format(selectedDate, "yyyy-MM-dd"),
      timeSlot: selectedTime,
      status: "confirmed",
      mode: "home",
    };
    addBooking(booking);
    setBooked(true);
    setTimeout(() => {
      navigate({ to: "/tutors" });
    }, 2000);
  }

  if (!tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4 px-6">
        <User className="w-14 h-14 text-muted-foreground" />
        <p className="text-muted-foreground font-body text-center">
          Tutor not found. Please go back and try again.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/tutors" })}
          className="btn-primary px-8"
          data-ocid="booking.back_button"
        >
          Back to Tutors
        </button>
      </div>
    );
  }

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-5 px-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
          }}
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-foreground mb-1">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground font-body text-sm">
            Demo class booked! We'll notify {tutor.name}
          </p>
        </div>
        <div
          className="w-full rounded-2xl p-4 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(79,158,248,0.08) 100%)",
          }}
        >
          <p className="font-display font-semibold text-foreground">
            {tutor.name}
          </p>
          {selectedDate && (
            <p className="text-sm text-muted-foreground font-body mt-1">
              {format(selectedDate, "EEE, MMM d")} · {selectedTime}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-body">
          Redirecting to tutors…
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="booking.page"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 pt-10 pb-4 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/tutors" })}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center transition-smooth hover:bg-white/30"
          data-ocid="booking.back_button"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="font-display font-bold text-white text-lg leading-tight">
            Book a Demo Class
          </h1>
          <p className="text-white/80 text-xs font-body mt-0.5 truncate max-w-[240px]">
            Schedule your first session with {tutor.name}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 pt-5 space-y-6">
          {/* Tutor Card */}
          <div
            className="flex items-center gap-3 bg-card rounded-2xl p-4"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            data-ocid="booking.tutor_card"
          >
            <img
              src={tutor.imageUrl}
              alt={tutor.name}
              className="w-12 h-12 rounded-full bg-muted object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold text-foreground text-sm truncate">
                  {tutor.name}
                </p>
                {tutor.isVerified && (
                  <span
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(79,158,248,0.12) 100%)",
                      color: "#6C63FF",
                    }}
                  >
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {tutor.subjects.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-body font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-display font-bold text-foreground">
                {tutor.rating}
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div data-ocid="booking.date_section">
            <h2 className="font-display font-bold text-foreground text-base mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Select Date
            </h2>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
              {days.map((day, idx) => {
                const isPast = isBefore(day, today);
                const isToday =
                  format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
                const isSelected =
                  selectedDate &&
                  format(day, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd");

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={isPast}
                    onClick={() => setSelectedDate(day)}
                    className="flex-shrink-0 flex flex-col items-center gap-1 w-14 py-3 rounded-2xl transition-smooth relative"
                    style={
                      isSelected
                        ? {
                            background:
                              "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                            boxShadow: "0 4px 12px rgba(108,99,255,0.35)",
                          }
                        : isPast
                          ? { background: "rgba(0,0,0,0.04)", opacity: 0.4 }
                          : {
                              background: "#F6F5FF",
                              border: "1.5px solid #E8E6FF",
                            }
                    }
                    data-ocid={`booking.date.${idx + 1}`}
                    aria-label={`Select ${format(day, "EEEE, MMMM d")}`}
                    aria-pressed={!!isSelected}
                  >
                    <span
                      className="text-[11px] font-body font-medium uppercase"
                      style={{
                        color: isSelected
                          ? "rgba(255,255,255,0.85)"
                          : isPast
                            ? "rgba(0,0,0,0.3)"
                            : "#8B8AAA",
                      }}
                    >
                      {format(day, "EEE")}
                    </span>
                    <span
                      className="text-lg font-display font-bold leading-none"
                      style={{
                        color: isSelected
                          ? "#fff"
                          : isPast
                            ? "rgba(0,0,0,0.3)"
                            : "#1A1A2E",
                      }}
                    >
                      {format(day, "d")}
                    </span>
                    {isToday && (
                      <span
                        className="text-[9px] font-body font-semibold"
                        style={{
                          color: isSelected
                            ? "rgba(255,255,255,0.75)"
                            : "#6C63FF",
                        }}
                      >
                        Today
                      </span>
                    )}
                    {!isToday && <span className="h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div data-ocid="booking.time_section">
            <h2 className="font-display font-bold text-foreground text-base mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Available Time Slots
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot, idx) => {
                const isBooked = BOOKED_SLOTS.has(slot);
                const isSelected = selectedTime === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                    className="h-11 rounded-xl text-sm font-body font-medium transition-smooth relative"
                    style={
                      isBooked
                        ? {
                            background: "rgba(0,0,0,0.04)",
                            color: "#BBBBBB",
                            border: "1.5px solid #EEEEEE",
                            cursor: "not-allowed",
                          }
                        : isSelected
                          ? {
                              background:
                                "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                              color: "#fff",
                              boxShadow: "0 4px 12px rgba(108,99,255,0.3)",
                              border: "none",
                            }
                          : {
                              background: "#fff",
                              color: "#1A1A2E",
                              border: "1.5px solid #E8E6FF",
                            }
                    }
                    data-ocid={`booking.time_slot.${idx + 1}`}
                    aria-pressed={isSelected}
                    aria-label={isBooked ? `${slot} - Booked` : slot}
                  >
                    {isBooked ? (
                      <span className="flex flex-col items-center leading-tight">
                        <span className="text-[11px]">{slot}</span>
                        <span className="text-[9px] font-semibold text-muted-foreground">
                          Booked
                        </span>
                      </span>
                    ) : (
                      slot
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          {canConfirm && (
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(108,99,255,0.07) 0%, rgba(79,158,248,0.07) 100%)",
                border: "1.5px solid rgba(108,99,255,0.15)",
              }}
              data-ocid="booking.summary_card"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                  }}
                >
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-foreground text-sm">
                  Your Class Summary
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">
                    Tutor
                  </span>
                  <span className="text-sm font-display font-semibold text-foreground">
                    {tutor.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">
                    Date
                  </span>
                  <span className="text-sm font-display font-semibold text-foreground">
                    {selectedDate
                      ? format(selectedDate, "EEE, MMM d yyyy")
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">
                    Time
                  </span>
                  <span className="text-sm font-display font-semibold text-foreground">
                    {selectedTime}
                  </span>
                </div>
                <div
                  className="border-t pt-2 flex items-center justify-between"
                  style={{ borderColor: "rgba(108,99,255,0.15)" }}
                >
                  <span className="text-xs text-muted-foreground font-body">
                    Duration
                  </span>
                  <span className="text-sm font-display font-semibold text-foreground">
                    1 hour
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">
                    Class type
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                      color: "#fff",
                    }}
                  >
                    Demo class — FREE
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button — sticky bottom */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-6 pt-3"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0))",
        }}
      >
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className="w-full h-[52px] rounded-2xl font-display font-bold text-base transition-smooth"
          style={
            canConfirm
              ? {
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(108,99,255,0.35)",
                }
              : {
                  background: "rgba(0,0,0,0.06)",
                  color: "#BBBBBB",
                  cursor: "not-allowed",
                }
          }
          data-ocid="booking.confirm_button"
        >
          {canConfirm ? "Confirm Booking" : "Select Date & Time"}
        </button>
        {!canConfirm && (
          <p className="text-center text-xs text-muted-foreground font-body mt-2">
            {!selectedDate && !selectedTime
              ? "Please pick a date and time slot"
              : !selectedDate
                ? "Please select a date"
                : "Please select a time slot"}
          </p>
        )}
      </div>
    </div>
  );
}

import Time "mo:core/Time";
import List "mo:core/List";
import BookingLib "../lib/booking";
import BookingTypes "../types/booking";
import Common "../types/common";

mixin (
  bookings : List.List<BookingTypes.Booking>,
  bookingIdCounter : List.List<Nat>,
) {
  public shared ({ caller }) func createBooking(req : BookingTypes.CreateBookingRequest) : async BookingTypes.Booking {
    let nextId = bookingIdCounter.at(0);
    let booking = BookingLib.createBooking(bookings, nextId, req, caller.toText(), Time.now());
    bookingIdCounter.put(0, nextId + 1);
    booking
  };

  public query func getBookings(studentId : Common.UserId) : async [BookingTypes.Booking] {
    BookingLib.getBookingsForStudent(bookings, studentId)
  };
};

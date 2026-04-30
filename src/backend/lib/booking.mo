import List "mo:core/List";
import Types "../types/booking";
import Common "../types/common";

module {
  public func createBooking(
    bookings : List.List<Types.Booking>,
    nextId : Nat,
    req : Types.CreateBookingRequest,
    studentId : Common.UserId,
    timestamp : Common.Timestamp,
  ) : Types.Booking {
    let booking : Types.Booking = {
      id = nextId;
      tutorId = req.tutorId;
      studentId = studentId;
      studentPhone = req.studentPhone;
      date = req.date;
      timeSlot = req.timeSlot;
      createdAt = timestamp;
    };
    bookings.add(booking);
    booking
  };

  public func getBookingsForStudent(
    bookings : List.List<Types.Booking>,
    studentId : Common.UserId,
  ) : [Types.Booking] {
    bookings.toArray().filter(func(b : Types.Booking) : Bool {
      b.studentId == studentId
    })
  };

  public func getBookingsForTutor(
    bookings : List.List<Types.Booking>,
    tutorId : Common.TutorId,
  ) : [Types.Booking] {
    bookings.toArray().filter(func(b : Types.Booking) : Bool {
      b.tutorId == tutorId
    })
  };
};

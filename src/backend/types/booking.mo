import Common "common";

module {
  public type BookingId = Nat;

  public type Booking = {
    id : BookingId;
    tutorId : Common.TutorId;
    studentId : Common.UserId;
    studentPhone : Text;
    date : Text;
    timeSlot : Text;
    createdAt : Common.Timestamp;
  };

  public type CreateBookingRequest = {
    tutorId : Common.TutorId;
    studentPhone : Text;
    date : Text;
    timeSlot : Text;
  };
};

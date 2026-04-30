import List "mo:core/List";
import Map "mo:core/Map";

import TutorTypes "types/tutor";
import BookingTypes "types/booking";
import ReviewTypes "types/review";
import UnlockTypes "types/unlock";

import TutorLib "lib/tutor";

import TutorApi "mixins/tutor-api";
import BookingApi "mixins/booking-api";
import ReviewApi "mixins/review-api";
import UnlockApi "mixins/unlock-api";

actor {
  let tutors = List.empty<TutorTypes.Tutor>();
  let bookings = List.empty<BookingTypes.Booking>();
  let reviews = List.empty<ReviewTypes.Review>();
  let unlocks = List.empty<UnlockTypes.ContactUnlock>();
  let freeUnlocksUsed = Map.empty<Text, Nat>();

  // Mutable counters wrapped in single-element lists for mixin mutation
  let bookingIdCounter = List.singleton<Nat>(0);
  let reviewIdCounter = List.singleton<Nat>(0);
  let unlockIdCounter = List.singleton<Nat>(0);

  // Seed sample tutors on first run
  TutorLib.initSampleTutors(tutors);

  include TutorApi(tutors);
  include BookingApi(bookings, bookingIdCounter);
  include ReviewApi(reviews, reviewIdCounter, tutors);
  include UnlockApi(unlocks, freeUnlocksUsed, unlockIdCounter, tutors);
};

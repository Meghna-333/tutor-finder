import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import UnlockLib "../lib/unlock";
import TutorLib "../lib/tutor";
import UnlockTypes "../types/unlock";
import TutorTypes "../types/tutor";
import Common "../types/common";

mixin (
  unlocks : List.List<UnlockTypes.ContactUnlock>,
  freeUnlocksUsed : Map.Map<Common.UserId, Nat>,
  unlockIdCounter : List.List<Nat>,
  tutors : List.List<TutorTypes.Tutor>,
) {
  public shared ({ caller }) func unlockContact(tutorId : Common.TutorId) : async UnlockTypes.UnlockResult {
    let userId = caller.toText();
    let tutor = switch (TutorLib.getTutorById(tutors, tutorId)) {
      case (?t) { t };
      case null { Runtime.trap("Tutor not found") };
    };
    let nextId = unlockIdCounter.at(0);
    let result = UnlockLib.unlockContact(unlocks, freeUnlocksUsed, nextId, userId, tutorId, tutor, Time.now());
    switch (result) {
      case (#success(_)) { unlockIdCounter.put(0, nextId + 1) };
      case _ {};
    };
    result
  };

  public query ({ caller }) func checkUnlockStatus(tutorId : Common.TutorId) : async UnlockTypes.UnlockStatus {
    UnlockLib.checkUnlockStatus(unlocks, freeUnlocksUsed, caller.toText(), tutorId)
  };
};

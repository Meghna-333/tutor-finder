import List "mo:core/List";
import Map "mo:core/Map";
import Types "../types/unlock";
import TutorTypes "../types/tutor";
import Common "../types/common";

module {
  let FREE_UNLOCK_LIMIT : Nat = 1;

  public func checkUnlockStatus(
    unlocks : List.List<Types.ContactUnlock>,
    freeUnlocksUsed : Map.Map<Common.UserId, Nat>,
    userId : Common.UserId,
    tutorId : Common.TutorId,
  ) : Types.UnlockStatus {
    let isUnlocked = unlocks.any(func(u : Types.ContactUnlock) : Bool {
      u.userId == userId and u.tutorId == tutorId
    });
    let used = switch (freeUnlocksUsed.get(userId)) {
      case (?n) { n };
      case null { 0 };
    };
    {
      isUnlocked = isUnlocked;
      hasFreeUnlock = used < FREE_UNLOCK_LIMIT;
      freeUnlocksUsed = used;
    }
  };

  public func unlockContact(
    unlocks : List.List<Types.ContactUnlock>,
    freeUnlocksUsed : Map.Map<Common.UserId, Nat>,
    nextId : Nat,
    userId : Common.UserId,
    tutorId : Common.TutorId,
    tutor : TutorTypes.Tutor,
    timestamp : Common.Timestamp,
  ) : Types.UnlockResult {
    // Check if already unlocked
    let existing = unlocks.find(func(u : Types.ContactUnlock) : Bool {
      u.userId == userId and u.tutorId == tutorId
    });
    switch (existing) {
      case (?_) {
        #alreadyUnlocked({ phone = tutor.phone; email = tutor.email })
      };
      case null {
        let used = switch (freeUnlocksUsed.get(userId)) {
          case (?n) { n };
          case null { 0 };
        };
        if (used < FREE_UNLOCK_LIMIT) {
          let unlock : Types.ContactUnlock = {
            id = nextId;
            tutorId = tutorId;
            userId = userId;
            unlockedAt = timestamp;
            usedFreeUnlock = true;
          };
          unlocks.add(unlock);
          freeUnlocksUsed.add(userId, used + 1);
          #success({ phone = tutor.phone; email = tutor.email; usedFreeUnlock = true })
        } else {
          #noFreeUnlockAvailable
        }
      };
    }
  };
};
